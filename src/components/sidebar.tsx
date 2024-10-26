import { ScrollArea } from '@mantine/core';
import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/logout';

interface SidebarProps {

}

const Sidebar: FC<SidebarProps> = ({ }) => {
    const navigate = useNavigate();

    return (
        <React.Fragment>
            <div className='relative h-full'>
                <ScrollArea>
                    <div className='bg-gray-100 hover:bg-blue-100 flex items-center p-2 rounded-xl text-sm font-semibold gap-3 mb-2' onClick={() => navigate('/app')}>
                        <div className='text-blue-500 bg-blue-100 p-2 rounded-lg'>
                            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-home">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                                <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                                <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                            </svg>
                        </div>
                        Dashboard
                    </div>

                    <div className='bg-gray-100 hover:bg-blue-100 flex items-center p-2 rounded-xl text-sm font-semibold gap-3 mb-2' onClick={() => navigate('/app/cities')}>
                        <div className='text-blue-500 bg-blue-100 p-2 rounded-lg'>
                            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-buildings">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M4 21v-15c0 -1 1 -2 2 -2h5c1 0 2 1 2 2v15" />
                                <path d="M16 8h2c1 0 2 1 2 2v11" />
                                <path d="M3 21h18" />
                                <path d="M10 12v0" />
                                <path d="M10 16v0" />
                                <path d="M10 8v0" />
                                <path d="M7 12v0" />
                                <path d="M7 16v0" />
                                <path d="M7 8v0" />
                                <path d="M17 12v0" />
                                <path d="M17 16v0" />
                            </svg>
                        </div>
                        Cities
                    </div>

                    <div className='bg-gray-100 hover:bg-blue-100 flex items-center p-2 rounded-xl text-sm font-semibold gap-3 mb-2' onClick={() => navigate('/app/theaters')}>
                        <div className='text-blue-500 bg-blue-100 p-2 rounded-lg'>
                            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-device-tv">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
                                <path d="M16 3l-4 4l-4 -4" />
                            </svg>
                        </div>
                        Theaters
                    </div>

                    <div className='bg-gray-100 hover:bg-blue-100 flex items-center p-2 rounded-xl text-sm font-semibold gap-3 mb-2' onClick={() => navigate('/app/movies')}>
                        <div className='text-blue-500 bg-blue-100 p-2 rounded-lg'>
                            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-movie">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
                                <path d="M8 4l0 16" />
                                <path d="M16 4l0 16" />
                                <path d="M4 8l4 0" />
                                <path d="M4 16l4 0" />
                                <path d="M4 12l16 0" />
                                <path d="M16 8l4 0" />
                                <path d="M16 16l4 0" />
                            </svg>
                        </div>
                        Movies
                    </div>
                </ScrollArea>
                <div className='bg-red-100 hover:bg-blue-100 flex items-center p-2 rounded-xl text-sm font-semibold gap-3 mb-2 absolute bottom-0 w-full' onClick={() => {logout(), navigate('/')}}>
                    <div className='text-red-500 bg-red-200 p-2 rounded-lg'>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-logout">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                            <path d="M9 12h12l-3 -3" />
                            <path d="M18 15l3 -3" />
                        </svg>
                    </div>
                    Logout
                </div>
            </div>
        </React.Fragment>
    );
};

export default Sidebar;