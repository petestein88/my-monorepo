import { BarChart2, Clock, Heart, Settings, HelpCircle, Menu, Trophy, Users, LogOut } from 'lucide-react'
import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { utils } from '../utils'
import DropdownUser from './Header/DropdownUser'
import useMediaQuery from '../hooks/useMediaQuery'
import useLogout from '../hooks/useLogout'

type NavigationItem = {
    name: string
    href: string
    icon: React.FC<React.SVGProps<SVGSVGElement>>
    onClick?: () => void // ✅ Make onClick optional
}
export default function Layout() {
    const location = useLocation()
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const isMobile = useMediaQuery('768px')
    const { logout } = useLogout()
    const navigation: NavigationItem[] = [
        { name: 'Summary', href: utils.helpers.getRoute('/'), icon: Clock },
        { name: 'Data', href: utils.helpers.getRoute('/data'), icon: BarChart2 },
        { name: 'Friends', href: utils.helpers.getRoute('/friends'), icon: Users },
        {
            name: 'Challenges',
            href: utils.helpers.getRoute('/challenges'),
            icon: Trophy
        },
        { name: 'FAQ', href: utils.helpers.getRoute('/faqs'), icon: HelpCircle }
    ]

    if (isMobile) {
        navigation.push({ name: 'Setting', href: utils.helpers.getRoute('/settings'), icon: Settings })
        navigation.push({ name: 'Logout', href: '#', icon: LogOut, onClick: () => logout() })
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <nav className='bg-white shadow-sm'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between h-16'>
                        <div className='flex'>
                            <div className='flex-shrink-0 flex items-center'>
                                <span className='text-xl font-bold text-gray-900'>Manumission</span>
                                <Heart className='h-5 w-5 text-red-500 ml-2' />
                            </div>
                        </div>

                        <div className='hidden md:flex sm:space-x-8'>
                            {navigation.map(item => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                                            location.pathname === item.href
                                                ? 'text-primary border-b-2 border-primary'
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        <Icon className='h-4 w-4 mr-2' />
                                        {item.name}
                                    </Link>
                                )
                            })}

                            <DropdownUser />
                        </div>

                        <div className='md:hidden flex items-center'>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className='text-gray-500 hover:text-gray-700'
                            >
                                <Menu className='h-6 w-6' />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className='md:hidden'>
                        <div className='pt-2 pb-3 space-y-1'>
                            {navigation.map(({ name, href, icon: Icon, onClick }) => (
                                <Link
                                    key={name}
                                    to={href}
                                    className={`block pl-3 pr-4 py-2 text-base font-medium ${
                                        location.pathname === href
                                            ? 'text-primary bg-indigo-50'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                                    onClick={onClick || (() => setIsMenuOpen(false))}
                                >
                                    <div className='flex items-center'>
                                        <Icon className='h-4 w-4 mr-2' />
                                        {name}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <Outlet />
            </main>
        </div>
    )
}
