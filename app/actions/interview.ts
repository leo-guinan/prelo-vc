'use server'

import {MongoClient} from "mongodb";
import {auth} from "@/auth";
import {nanoid, prisma} from "@/lib/utils";
import {BufferMemory} from "langchain/memory";
import {MongoDBChatMessageHistory} from "@langchain/mongodb";
import {User} from "@prisma/client/edge";

export async function getInterviewChat(userId?:string) {

    const client = new MongoClient(process.env.MONGO_URL || "");
    await client.connect();
    const collection = client.db("prelovc").collection("prelovc_memory");
    const session = await auth()
    if (!session?.user) {
            return {
                error: "User not found"
            }
        }
    let user:User | null = null;
    if (userId && (session.user as User).role === 'admin') {
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


    const memory = new BufferMemory({
        chatHistory: new MongoDBChatMessageHistory({
            collection,
            sessionId: `custom_claude_${lookupUUID}_chat`,
        }),
    });

    const messages = await memory.chatHistory.getMessages();

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
                            recommended_next_steps: parsed.recommended_next_steps,
                            content: parsed.report_summary

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


export async function sendInterviewChatMessage(uuid: string, formData: FormData) {
    const session = await auth()

    if (!session?.user) {
        return {
            error: "User not found"
        }
    }

    const userId = session.user.id;
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
    })

    if (!user) {
        return {
            error: "User not found"
        }
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
    formData.append('investor_id', userId);
    formData.append('firm_id', '1');

    console.log("FormData: ", formData)

    const sendMessageResponse = await fetch(`${process.env.PRELO_API_URL as string}interview/send/`, {
        method: "POST",
        headers: {
            Authorization: `Api-Key ${process.env.PRELO_API_KEY}`
        },
        body: formData
    })

    const parsed = await sendMessageResponse.json()

    console.log("Parsed", parsed)
    return {
        message: parsed.message,
    }
}

export async function createPitchDeck(deckUUID: string) {
    const session = await auth()

    if (!session?.user) {
        return {
            error: "User not found"
        }
    }

    const userId = session.user.id;
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
            name: "Pitch Deck"
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
    console.log("parsed query params", queryParams)

    const view = queryParams.view
    console.log("view", view)
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
        console.log("Parsed", parsed)
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
                founderContactInfo: JSON.parse(parsed.founders_contact_info).results
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
                investor_id: session.user.id
            })

        })
         const parsed = await getRejectionEmailResponse.json()
        console.log("Parsed", parsed)
        return {
            type: "rejection_email",
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