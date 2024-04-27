'use server'

import { MongoClient } from "mongodb"
import {auth} from "@/auth";
import {nanoid, prisma} from "@/lib/utils";

export async function getUploadUrl(filename: string): Promise<{ url: string, pitchDeckId: number } | { error: string }> {
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

export async function createDocument(userId: string, content: string, dbName= "myaicofounder", collectionName = "documents") {
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
     const url = `${process.env.PRELO_API_URL as string}get_scores/?pitch_deck_id=${pitchDeckId}`

    const rawScoreResponse = await fetch(url, {
        method: 'GET',
        headers: {
            "Authorization": `Api-Key ${process.env.PRELO_API_KEY}`
        }
    })
    const rawScore = await rawScoreResponse.json()
    console.log(rawScore)
    if (!rawScore.scores) {
        return {
            error: "Scores not found"
        }
    }
    return rawScore.scores
}