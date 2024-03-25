'use client'

import {cn} from '@/lib/utils'
import React, {useEffect, useState} from 'react'
import ThoughtRecorder from "@/components/thought-recorder";
import {Thought} from "@/components/thought";
import {Task, Thought as ThoughtType} from "@/lib/types";
import {addThoughtToContext, filterThoughts} from "@/app/(actions)/actions/thoughts";
import ThoughtFilter from "@/components/thought-filter";
import LoadingSpinner from "@/components/loading-spinner";

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'


export interface ContextProps extends React.ComponentProps<'div'> {
    initialThoughts?: ThoughtType[]
    initialTasks?: Task[]
    contextName: string
    contextId: number
}

export function TodayContext({contextId, contextName, initialThoughts, initialTasks, className}: ContextProps) {
    const [thoughts, setThoughts] = useState<ThoughtType[]>([])
    const [waitOn, setWaitOn] = useState<string>("")

    useEffect(() => {
        // const newThoughts = initialThoughts?.map((thought) => thought.content) ?? []
        if (initialThoughts) setThoughts(initialThoughts)
    }, [initialThoughts])

    const rememberThought = async (thoughtContent: string) => {

        setThoughts([{
            id: -1,
            content: thoughtContent,
            ownerId: '',
            contextId: contextId,
            createdAt: "Now"
        }, ...thoughts])

        const thought = await addThoughtToContext(contextId, thoughtContent)
        if ('error' in thought) {
            console.error(thought.error)
            return
        }
        console.log(thought)
        if (thoughts) {
            setThoughts([thought, ...thoughts])
        } else {
            setThoughts([thought])
        }
    }

    const applyFilter = async (thoughtFilter: string) => {
        if (!thoughtFilter) {
            setThoughts(initialThoughts ?? [])
            return
        }
        setWaitOn("Filtering thoughts...")
        const filteredThoughts = await filterThoughts(contextId, thoughtFilter)
        if ('error' in filteredThoughts) {
            console.error(filteredThoughts.error)
            setWaitOn("")
            return
        }
        setThoughts(filteredThoughts)
        setWaitOn("")
    }

    return (
        <>
            {waitOn && (
                <div className={cn('flex justify-center items-center', className)}>
                    <LoadingSpinner label={waitOn}/>
                </div>
            )}
            {/*create 2 column tailwind flex container*/}
            <div className="p-4 flex flex-wrap justify-center">
                <div className="flex flex-col w-1/2">
                    <div className="p-4 flex flex-wrap justify-center">
                        <div className="flex flex-col w-1/2">
                            <ThoughtRecorder rememberThought={rememberThought}/>
                        </div>
                        {!waitOn && (
                            <div className={`flex flex-wrap justify-center  ${className}`} style={{gap: '1rem'}}>
                                {thoughts?.map((thought, index) => (
                                    <div key={index} className='w-full sm:w-1/2 lg:w-1/4 p-2'>
                                        <Thought thought={thought}/>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col w-1/2">
                    {/*    Column for today's tasks*/}
                    </div>
                </div>
            </div>


        </>
    )
}
