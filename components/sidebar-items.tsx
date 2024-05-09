'use client'

import {AnimatePresence, motion} from 'framer-motion'
import {SidebarItem} from '@/components/sidebar-item'
import {PitchDeckRequest} from "@prisma/client/edge";


interface SidebarItemsProps {
    decks?: PitchDeckRequest[]
}

export function SidebarItems({decks}: SidebarItemsProps) {
    if (!decks?.length) return null

    return (
        <AnimatePresence>
            {decks.map(
                (deck, index) =>
                    deck && (
                        <motion.div
                            key={deck?.id}
                            exit={{
                                opacity: 0,
                                height: 0
                            }}
                        >
                            <SidebarItem index={index} deck={deck}>
                                <></>
                            </SidebarItem>
                        </motion.div>
                    )
            )}
        </AnimatePresence>
    )
}
