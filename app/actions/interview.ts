'use server'

import { MongoClient } from "mongodb";
import { auth } from "@/auth";
import { nanoid, prisma } from "@/lib/utils";
import { BufferMemory } from "langchain/memory";
import { MongoDBChatMessageHistory } from "@langchain/mongodb";
import { GlobalRole, PitchDeckProcessingStatus, User } from "@prisma/client/edge";
import { SubmindFormData } from "@/components/CreateSubmindModal";
import { logEvent } from "@/lib/telemetry";

export async function getInterviewChat(userId?: string) {

    const client = new MongoClient(process.env.MONGO_URL || "");
    await client.connect();
    const collection = client.db("prelovc").collection("prelovc_memory");
    const session = await auth()
    if (!session?.user) {
        return {
            error: "User not found"
        }
    }
    let user: User | null = null;
    if (userId && (session.user as User).globalRole === GlobalRole.SUPERADMIN) {
        user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
    } else {
        user = session.user as User
    }

    if (!user) {
        return {
            error: "User not found"
        }
    }

    let lookupUUID = user.interviewUUID

    if (!lookupUUID) {
        const newUUID = nanoid()
        await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                interviewUUID: newUUID
            }
        })
        lookupUUID = newUUID
    }

    const history = new MongoDBChatMessageHistory({
        collection,
        sessionId: `custom_claude_${lookupUUID}_chat`,
    })


    const memory = new BufferMemory({
        chatHistory: history
    });

    const messages = await history.getMessages();

    const interpretedMessages = messages.map((message) => {
        try {
            const parsed = JSON.parse(message.content.toString())
            switch (parsed.status) {
                case 'analyzed':
                    return {
                        type: "deck_report",
                        id: nanoid(),
                        deck_uuid: parsed.deck_uuid,
                        report_uuid: parsed.report_uuid,
                        deck_score: parsed.deck_score,
                        report_summary: parsed.report_summary,
                        role: "assistant",
                        recommended_next_steps: JSON.parse(parsed.recommended_next_steps),
                        content: parsed.report_summary,
                        company_name: parsed.company_name

                    }
                default:
                    return {
                        id: nanoid(),
                        content: message.content.toString(),
                        role: message._getType() === "human" ? "user" : "assistant",
                        type: "text"
                    }
            }
        } catch (e: any) {
            return {
                id: nanoid(),
                content: message.content.toString(),
                role: message._getType() === "human" ? "user" : "assistant",
                type: "text"

            }
        }
    }
    )


    return {
        id: lookupUUID,
        title: "Chat",
        userId: session.user.id,
        messages: interpretedMessages

    }
}


export async function sendInterviewChatMessage(uuid: string, formData: FormData, userId: string) {
    const session = await auth()

    if (!session?.user) {
        return {
            error: "User not found"
        }
    }

    let user: User | null = null;
    if (userId !== session.user.id && (session.user as User).globalRole === GlobalRole.SUPERADMIN) {
        console.log("Have user id and user is superadmin")
        user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
    } else {
        user = session.user as User
    }

    if (!user?.submindId) {
        return {
            error: "Configure submind before running this step."
        }
    }

    // Add the submind_id to the FormData
    formData.append('submind_id', `${user.submindId}`);
    formData.append('uuid', uuid);
    formData.append('client', 'prelovc');
    formData.append('investor_id', user.id);
    formData.append('firm_id', '1');
    if (user.currentDeckUUID) {
        formData.append('deck_uuid', user.currentDeckUUID);
    }


    const sendMessageResponse = await fetch(`${process.env.PRELO_API_URL as string}interview/send/`, {
        method: "POST",
        headers: {
            Authorization: `Api-Key ${process.env.PRELO_API_KEY}`
        },
        body: formData
    })

    const parsed = await sendMessageResponse.json()
    if (parsed.type === "email") {
        return {
            type: "email",
            message: {
                to: parsed.email,
                subject: parsed.subject,
                body: parsed.content
            }
        }
    } else if (parsed.type === "message") {
        return {
            type: "message",
            message: parsed.message
        }
    } else {
        return {
            type: "message",
            message: parsed.message
        }
    }

}

export async function createPitchDeck(deckUUID: string, userId: string, fileName: string | null) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        include: {
            memberships: true
        }
    })

    if (!user) {
        return {
            error: "User not found"
        }
    }

    await prisma.pitchDeck.create({
        data: {
            uuid: deckUUID,
            owner: {
                connect: {
                    id: user.memberships[0].organizationId
                }
            },
            name: fileName || "Pitch Deck"
        }
    })
}

interface PanelDetails {
    type: string
    data: Record<string, any>
}

export async function getPanelDetails(urlWithParams: string): Promise<PanelDetails> {
    const session = await auth()
    if (!session?.user) {
        return {
            type: "error",
            data: {
                error: "User not found"
            }
        }
    }
    const url = new URL(urlWithParams)
    const queryParams = Object.fromEntries(url.searchParams.entries())

    const view = queryParams.view
    if (view === "report" || view === 'email') {
        const getInvestorReportResponse = await fetch(`${process.env.PRELO_API_URL as string}deck/investor/report/`, {
            method: "POST",
            headers: {
                Authorization: `Api-Key ${process.env.PRELO_API_KEY}`
            },
            body: JSON.stringify({
                deck_uuid: queryParams.deck_uuid,
                report_uuid: queryParams.report_uuid
            })

        })
        // companyName={''}
        //                 pitchDeckSummary={''}
        //                 concerns={''}
        //                 believe={''}
        //                 amountRaising={''}
        //                 recommendation={''}
        //                 investmentScore={0}
        //              traction={''}
        const parsed = await getInvestorReportResponse.json()
        try {
            return {
                type: "deck_report",
                data: {
                    companyName: parsed.company_name,
                    pitchDeckSummary: parsed.summary,
                    believe: parsed.believe,
                    traction: parsed.traction,
                    concerns: JSON.parse(parsed.concerns).concerns,
                    investmentScore: parsed.investment_potential_score,
                    amountRaising: parsed.amount_raising,
                    recommendation: parsed.recommendation_reasons,
                    nextStep: JSON.parse(parsed.recommended_next_steps),
                    executiveSummary: parsed.executive_summary,
                    founders: JSON.parse(parsed.founders),
                    scores: parsed.scores,
                    founderContactInfo: JSON.parse(parsed.founders_contact_info).results,
                    scoreExplanation: parsed.score_explanation
                }
            }
        } catch (e: any) {
            console.log("Error, returning empty json objects", e)
            return {
                type: "deck_report",
                data: {
                    companyName: parsed.company_name,
                    pitchDeckSummary: parsed.summary,
                    believe: parsed.believe,
                    traction: parsed.traction,
                    concerns: [],
                    investmentScore: parsed.investment_potential_score,
                    amountRaising: parsed.amount_raising,
                    recommendation: parsed.recommendation_reasons,
                    nextStep: [],
                    executiveSummary: parsed.executive_summary,
                    founders: JSON.parse(parsed.founders),
                    scores: parsed.scores,
                    founderContactInfo: [],
                    scoreExplanation: parsed.score_explanation
                }
            }
        }

    } else if (view === "rejection_email") {
        const getRejectionEmailResponse = await fetch(`${process.env.PRELO_API_URL as string}deck/investor/reject/`, {
            method: "POST",
            headers: {
                Authorization: `Api-Key ${process.env.PRELO_API_KEY}`
            },
            body: JSON.stringify({
                deck_uuid: queryParams.deck_uuid,
                investor_id: session.user.id,
                submind_id: (session.user as User).submindId
            })

        })
        const parsed = await getRejectionEmailResponse.json()
        return {
            type: "rejection_email",
            data: {
                email: parsed.email,
                content: parsed.content,
                subject: parsed.subject

            }
        }
    } else if (view === 'meeting_email') {
        const getMeetingEmailResponse = await fetch(`${process.env.PRELO_API_URL as string}deck/investor/meeting/`, {
            method: "POST",
            headers: {
                Authorization: `Api-Key ${process.env.PRELO_API_KEY}`
            },
            body: JSON.stringify({
                deck_uuid: queryParams.deck_uuid,
                investor_id: session.user.id,
                submind_id: (session.user as User).submindId

            })

        })
        const parsed = await getMeetingEmailResponse.json()
        return {
            type: "rejection_email",
            data: {
                email: parsed.email,
                content: parsed.content,
                subject: parsed.subject

            }
        }
    } else if (view === "more_info_email") {
        const getMeetingEmailResponse = await fetch(`${process.env.PRELO_API_URL as string}deck/investor/more_info/`, {
            method: "POST",
            headers: {
                Authorization: `Api-Key ${process.env.PRELO_API_KEY}`
            },
            body: JSON.stringify({
                deck_uuid: queryParams.deck_uuid,
                investor_id: session.user.id,
                submind_id: (session.user as User).submindId

            })

        })
        const parsed = await getMeetingEmailResponse.json()
        return {
            type: "more_info_email",
            data: {
                email: parsed.email,
                content: parsed.content,
                subject: parsed.subject

            }
        }
    } else if (view === "coinvestor_email") {
        const getMeetingEmailResponse = await fetch(`${process.env.PRELO_API_URL as string}deck/investor/coninvestor/`, {
            method: "POST",
            headers: {
                Authorization: `Api-Key ${process.env.PRELO_API_KEY}`
            },
            body: JSON.stringify({
                deck_uuid: queryParams.deck_uuid,
                investor_id: session.user.id,
                submind_id: (session.user as User).submindId

            })

        })
        const parsed = await getMeetingEmailResponse.json()
        return {
            type: "coninvestor_email",
            data: {
                email: parsed.email,
                content: parsed.content,
                subject: parsed.subject

            }
        }
    }

    return {
        type: "data is here...",
        data: {}
    }
}

export async function getDecks(userId: string) {

    let userWithOrg = await prisma.user.findUnique({
        where: {
            id: userId
        },
        include: {
            memberships: {
                include: {
                    organization: true
                }
            }
        }
    })
    if (!userWithOrg) {
        return []
    }

    if (!userWithOrg.memberships[0]) {
        const org = await prisma.organization.create({
            data: {
                name: "Default Organization",
            }
        })
        const membership = await prisma.membership.create({
            data: {
                organizationId: org.id,
                userId: userWithOrg.id,
                role: "OWNER"
            }
        })
        userWithOrg = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                memberships: {
                    include: {
                        organization: true
                    }
                }
            }
        })


    }

    const decks = await prisma.pitchDeck.findMany({
        where: {
            owner: {
                id: userWithOrg!.memberships[0].organizationId
            }
        }
    })

    return decks ?? []
}

export async function getDeck(deckUUID: string) {
    let deck = await prisma.pitchDeck.findUnique({
        where: {
            uuid: deckUUID
        }
    })
    if (!deck) {
        return null
    }

    if (!deck.reportUUID || !deck.matchScore) {
        const getInvestorReportResponse = await fetch(`${process.env.PRELO_API_URL as string}deck/investor/report/status/`, {
            method: "POST",
            headers: {
                Authorization: `Api-Key ${process.env.PRELO_API_KEY}`
            },
            body: JSON.stringify({
                deck_uuid: deckUUID
            })

        })
        const parsed = await getInvestorReportResponse.json()
        if (parsed.report_uuid) {
            deck = await prisma.pitchDeck.update({
                where: {
                    uuid: deckUUID
                },
                data: {
                    reportUUID: parsed.report_uuid,
                    status: PitchDeckProcessingStatus.COMPLETE,
                    matchScore: parsed.match_score
                }
            })
        }
    }

    return deck
}


export async function createSubmind(data: SubmindFormData) {
    console.log("Creating submind", data)
    const session = await auth()
    if (!session?.user) {
        return {
            error: "User not found"
        }
    }
    let user = await prisma.user.findUnique({
        where: {
            id: session.user.id
        },
        include: {
            memberships: true
        }
    })
    user = await prisma.user.update({
        where: {
            id: session.user.id
        },
        include: {
            memberships: true
        },
        data: {
            submindPending: true,
            firstName: data.firstName,
            lastName: data.lastName
        }
    })
    console.log("Set submind pending to true")
    if (!user || !user.interviewUUID) {
        return {
            error: "User not found"
        }
    }

    if (!user.memberships[0]) {
        const org = await prisma.organization.create({
            data: {
                name: "Default Organization",
            }
        })
        const membership = await prisma.membership.create({
            data: {
                organizationId: org.id,
                userId: user.id,
                role: "OWNER"
            }
        })
        user = await prisma.user.findUnique({
            where: {
                id: user.id
            },
            include: {
                memberships: {
                    include: {
                        organization: true
                    }
                }
            }
        })


    }

    if (!user || !user.memberships[0]) {
        return {
            error: "User not found"
        }
    }

    const submindResponse = await fetch(`${process.env.PRELO_API_URL as string}deck/investor/submind/`, {
        method: "POST",
        headers: {
            Authorization: `Api-Key ${process.env.PRELO_API_KEY}`
        },
        body: JSON.stringify({
            first_name: data.firstName,
            last_name: data.lastName,
            firm_name: data.firmName,
            firm_url: data.firmUrl,
            conversation_uuid: user.interviewUUID,
            special_notes: data.specialNotes,
            user_id: user.id,
            organization_id: user.memberships[0].organizationId,
            slug: data.slug,
            email: user.email
        })

    })


    const parsed = await submindResponse.json()
    console.log("Submind created", parsed)
    return parsed
}


export async function configureSubmind(userId: string, submindId: number, organizationName: string, thesis: string, industries: string, checkSize: string, passion: string, slug: string, name:string) {
    console.log("Configuring submind", submindId)
    logEvent("configure_submind", {
        submind_id: submindId,
        organization_name: organizationName,        
        slug: slug,
        name: name
    })
    // what do we need to configure.
    // add the submind id to the user.
    // update the organization name
    // create the shareprofile

    // do I need an image url as well? Later.

    
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        include: {
            memberships: true
        }
    })
    if (!user) {
        return {
            error: "User not found"
        }
    }
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            submindId: submindId,
            slug: slug,
            submindPending: false,
            chatUrl: `${process.env.NEXT_PUBLIC_APP_URL as string}share/investor/${slug}`
        }
    })
    await prisma.organization.update({
        where: {
            id: user.memberships[0].organizationId
        },
        data: {
            name: organizationName
        }
    })
    await prisma.shareProfile.upsert({
        where: {
            userId: user.id
        },
        update: {
            name: name,
            company: organizationName,
            avatarUrl: user.image ?? "",
            thesis: thesis,
            industries: industries,
            checkSize: checkSize,
            passion: passion,            
        },
        create: {
            name: name,
            company: organizationName,
            avatarUrl: user.image ?? "",
            thesis: thesis,
            industries: industries,
            checkSize: checkSize,
            passion: passion,
            user: {
                connect: {
                    id: user.id
                }
            }
        }
    })
}

export async function getSubmindPending(key: string) {
    // parse userid from string
    const userId = key.split("/")[3]
    console.log("Getting submind pending", userId)

    if (!userId) {
        return false
    }
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!user?.submindPending) {
        return false
    }

    if (user.submindPending) {
        console.log("User has submind pending, checking status")
        const submindResponse = await fetch(`${process.env.PRELO_API_URL as string}deck/investor/submind/status/`, {
            method: "POST",
            headers: {
                Authorization: `Api-Key ${process.env.PRELO_API_KEY}`
            },
            body: JSON.stringify({
                user_id: userId
            })

        })
        const parsed = await submindResponse.json()
        console.log("Submind status", parsed)
        if (parsed.submind_id) {
            console.log("Submind id found, configuring submind")
            configureSubmind(userId, parsed.submind_id, parsed.company, parsed.thesis, parsed.industries, parsed.check_size, parsed.passion, parsed.slug, parsed.name)
        }
    }



    return user?.submindPending
}


export async function checkSlugUniquenessAction(slug: string) {
    const user = await prisma.user.findUnique({
        where: {
            slug: slug
        }
    })
    return !user
}
