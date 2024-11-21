'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { crypto, stock, golden } from '@/images'

type Task = {
    icon: string | React.FC<{ className?: string }> ;
    title: string;
    reward: string;
    link?: string;
}

const TasksTab = () => {
    const [activeTab, setActiveTab] = useState<'in-game' | 'partners'>('in-game')

    const tasks: Task[] = [
        {
            icon: crypto.src,  // Assuming these are image paths, use .src for Image component
            title: 'Crypto AI Investment',
            reward: '100%',
            link: '/crypto',
        },
        {
            icon: stock.src,
            title: 'Stock Market Investment',
            reward: '50%',
            link: '/stock',
        },
        {
            icon: golden.src,
            title: 'Golden Investment',
            reward: '%150',
            link: '/golden',
        },
    ]

    const partnerTasks: Task[] = [
        {
            icon: crypto.src,
            title: 'Join Blum Channel',
            reward: '+ 1,000 PAWS',
        },
    ]

    return (
        <div className={`quest-tab-con transition-all duration-300 flex justify-start h-screen flex-col bg-gradient-to-b from-green-500 to-teal-500 px-1`}>
            {/* Tab Switcher */}
            <div className="flex gap-4 mt-4">
                <button
                    onClick={() => setActiveTab('in-game')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition duration-300 
                        ${activeTab === 'in-game' ? 'bg-[green] text-black' : 'bg-[#151515] text-white'}`}
                >
                    AI Software
                </button>
                <button
                    onClick={() => setActiveTab('partners')}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition duration-300 
                        ${activeTab === 'partners' ? 'bg-[green] text-black' : 'bg-[#151515] text-white'}`}
                >
                    Game
                    <div className="bg-[#5a5a5a] text-[#fefefe] size-4 rounded-full flex items-center justify-center text-[11px]">
                        1
                    </div>
                </button>
            </div>

            {/* Tasks List */}
            <div className="mt-4 mb-20 bg-[#151516] rounded-xl">
                {(activeTab === 'in-game' ? tasks : partnerTasks).map((task, index) => (
                    <div key={index} className="flex items-center">
                        <div className="w-[72px] flex justify-center">  {/* Fixed width container for icons */}
                            <div className="w-10 h-10">  {/* Fixed size container */}
                                {typeof task.icon === 'string' ? (
                                    <Image
                                        src={task.icon}
                                        alt={task.title}
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-contain rounded-full"
                                    />
                                ) : (
                                    <task.icon className="w-full h-full rounded-full" />
                                )}
                            </div>
                        </div>
                        <div className={`flex items-center justify-between w-full py-4 pr-4 ${index !== 0 && "border-t border-[#222622]"}`}>
                            <div>
                                <div className="text-[17px]">{task.title}</div>
                                <div className="text-gray-400 text-[14px]">{task.reward}</div>
                            </div>
                            {task.link && (
                                <Link href={task.link}>
                                    <button className="h-8 bg-white text-black px-4 rounded-full text-sm font-medium flex items-center">
                                        Start
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TasksTab
