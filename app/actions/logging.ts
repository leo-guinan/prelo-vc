'use server'



export async function logError(error: string) {
    console.error(error)
}

export async function logEvent(event: string, payload: Record<string, any>) {
    console.log(event, payload)
}