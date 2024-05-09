'use server'

import {MongoClient} from "mongodb"
import {auth} from "@/auth";
import {nanoid, prisma} from "@/lib/utils";
import {BufferMemory} from "langchain/memory";
import {MongoDBChatMessageHistory} from "@langchain/mongodb";
import {redirect} from "next/navigation";

export async function getUploadUrl(filename: string): Promise<{ url: string, pitchDeckId: number } | {
    error: string
}> {
    const session = await auth()
    if (!session?.user) {
        return {
            error: "User not found"
        }
    }
    const document = await createDocument(session.user.id, "Pitch deck analysis still running...", "prelo")
    // make filename url safe
    const safeFilename = encodeURIComponent(filename)
    const url = `${process.env.PRELO_API_URL as string}get_upload_url/?filename=${safeFilename}&uuid=${document.documentId}`
    console.log(url)
    const uploadUrlResponse = await fetch(url, {
        method: 'GET',
        headers: {
            "Authorization": `Api-Key ${process.env.PRELO_API_KEY}`
        }

    })


    const parsed = await uploadUrlResponse.json()

    const pitchDeckRequest = await prisma.pitchDeckRequest.create({
        data: {
            uuid: document.documentId,
            backendId: parsed.pitch_deck_id,
            ownerId: session.user.id,
        }
    })
    console.log("Pitch deck request", pitchDeckRequest)
    return {
        url: parsed.upload_url,
        pitchDeckId: pitchDeckRequest.id
    }
}


export async function getPitchDeck(id: number) {
    const session = await auth()
    if (!session?.user) {
        return {
            error: "User not found"
        }
    }
    const pitchDeckRequest = await prisma.pitchDeckRequest.findUnique({
        where: {
            id,
            ownerId: session.user.id
        }
    })

    if (!pitchDeckRequest) {
        return {
            error: "Pitch deck not found"
        }
    }

    const document = await getDocument(pitchDeckRequest.uuid, "prelo")
    console.log("Pitch deck document", document)
    return document
}

export async function createDocument(userId: string, content: string, dbName = "myaicofounder", collectionName = "documents") {
    const client = await MongoClient.connect(process.env.MONGO_URL as string);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const uuid = nanoid();
    await collection.insertOne({content, createdAt: new Date(), userId, uuid});

    await client.close();
    return {
        documentId: uuid,
        content
    }
}

export async function getDocument(documentId: string, dbName = "myaicofounder", collectionName = "documents") {

    const session = await auth()

    if (!session?.user?.id) {
        return {
            error: "Unauthorized"
        }
    }

    const client = await MongoClient.connect(process.env.MONGO_URL as string);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const document = await collection.findOne({uuid: documentId, userId: session.user.id});
    if (!document) {
        return {
            error: "Document not found"
        }
    }
    await client.close();
    return document;

}

export async function getScores(pitchDeckId: number) {
    const pitchDeck = await prisma.pitchDeckRequest.findUnique({
        where: {
            id: pitchDeckId
        }
    })
    if (!pitchDeck) {
        return {
            error: "Pitch deck not found"
        }
    }

    const url = `${process.env.PRELO_API_URL as string}get_scores/?pitch_deck_id=${pitchDeck.backendId}`

    const rawScoreResponse = await fetch(url, {
        method: 'GET',
        headers: {
            "Authorization": `Api-Key ${process.env.PRELO_API_KEY}`
        }
    })
    const rawScore = await rawScoreResponse.json()
    console.log(rawScore)
    if (!rawScore.scores) {
        return null
    }

    if(pitchDeck.name === "Loading deck name...") {
        await prisma.pitchDeckRequest.update({
            where: {
                id: pitchDeckId
            },
            data: {
                name: rawScore.name
            }
        })
    }
    return rawScore.scores
}

export async function getAnalysisChat(id: number) {

    const client = new MongoClient(process.env.MONGO_URL || "");
    await client.connect();
    const collection = client.db("scoremydeck").collection("scoremydeck_memory");
    const session = await auth()
    if (!session?.user) {
        return {
            error: "User not found"
        }
    }
    const pitchDeckRequest = await prisma.pitchDeckRequest.findUnique({
        where: {
            id,
            ownerId: session.user.id
        }
    })

    if (!pitchDeckRequest) {
        return {
            error: "Pitch deck not found"
        }
    }

    const document = await getDocument(pitchDeckRequest.uuid, "prelo")

    if ('error' in document) {
        return {
            error: document.error
        }
    }
    if (document.status !== "complete") {
        console.log("Document not complete")
        return {
            id: document.uuid,
            title: "Chat",
            userId: session.user.id,
            messages: []
        }

    }

    const memory = new BufferMemory({
        chatHistory: new MongoDBChatMessageHistory({
            collection,
            sessionId: `${document.uuid}_chat`,
        }),
    });

    const messages = await memory.chatHistory.getMessages();
    return {
        id: document.uuid,
        title: "Chat",
        userId: session.user.id,
        messages: messages.map((message) => {
            return {
                id: nanoid(),
                content: message.content.toString(),
                role: message._getType() === "human" ? "user" : "assistant"
            }
        })
    }
}

export async function sendChatMessage(uuid: string, message: { content: string, role: "user" | "assistant" }) {
    const client = new MongoClient(process.env.MONGO_URL || "");
    await client.connect();
    const collection = client.db("scoremydeck").collection("scoremydeck_memory");
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

    const history = new MongoDBChatMessageHistory({
        collection: collection,
        sessionId: `${uuid}_chat`,
    })
    await history.addUserMessage(message.content)

    const sendMessageResponse = await fetch(`${process.env.PRELO_API_URL as string}founder/send/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Api-Key ${process.env.PRELO_API_KEY}`
        },
        body: JSON.stringify({
            uuid,
            message: message.content,
        })
    })

    const parsed = await sendMessageResponse.json()

    console.log("Parsed", parsed)
    return parsed.message

}

export async function clearCurrentDeck() {
    const session = await auth()
    if (!session?.user) {
        return {
            error: "User not found"
        }
    }
    await prisma.user.update({
        where: {
            id: session.user.id
        },
        data: {
            currentDeckId: null
        }
    })
    console.log("Clear.")
    return redirect("/")
}

export async function getDeckName(id: number) {

    const pitchDeckRequest = await prisma.pitchDeckRequest.findUnique({
        where: {
            id,
        }
    })

    if (!pitchDeckRequest) {
        return {
            error: "Pitch deck not found"
        }
    }

    const sendMessageResponse = await fetch(`${process.env.PRELO_API_URL as string}get_name/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Api-Key ${process.env.PRELO_API_KEY}`
        },
        body: JSON.stringify({
            deck_id: pitchDeckRequest.backendId
        })
    })

    const parsed = await sendMessageResponse.json()

    if (parsed.name) {
        await prisma.pitchDeckRequest.update({
            where: {
                id
            },
            data: {
                name: parsed.name
            }
        })
    }

    return parsed.name
}

export async function triggerCheck() {
     await fetch(`${process.env.PRELO_API_URL as string}check_decks/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Api-Key ${process.env.PRELO_API_KEY}`
        },
        body: JSON.stringify({})
    })
}