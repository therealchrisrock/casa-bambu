'use client'

import React, { useEffect, useState } from 'react'
import { clearAllBodyScrollLocks } from 'body-scroll-lock'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { Header as HeaderType, User } from '../../../../payload/payload-types'
import { useAuth } from '../../../_providers/Auth'
import { CartLink } from '../../CartLink'
import { CMSLink } from '../../Link'

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/_components/ui/dialog'

import classes from './index.module.scss'

export const HeaderNav: React.FC<{ isMobile?: boolean; header: HeaderType }> = ({
  header,
  isMobile,
}) => {
  const navItems = header?.navItems || []
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const pathname = usePathname()

  useEffect(() => {
    // Triggered when the pathname changes
    setOpen(false)
    clearAllBodyScrollLocks()
    // Place your logic here (e.g., analytics)
  }, [pathname])

  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button>
            <HamburgerIcon />
          </button>
        </DialogTrigger>
        <DialogContent
          className={'h-full w-full min-w-full pt-4 rounded-none'}
          showAnimation={false}
          showOverlay={false}
        >
          <div>
            <div className={'flex h-full items-center'}>
              <nav className={'flex-1'}>
                {navItems.map(({ link }, i) => {
                  return (
                    <div className={'w-full py-4 text-center'} key={i}>
                      <CMSLink className={'text-3xl '} {...link} />
                    </div>
                  )
                })}
              </nav>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <nav
      className={[
        classes.nav,
        // fade the nav in on user load to avoid flash of content and layout shift
        // Vercel also does this in their own website header, see https://vercel.com
        user === undefined && classes.hide,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="none" />
      })}
      {/*<CartLink />*/}
      {/*{user && <Link href="/account">Account</Link>}*/}
      {/*{!user && (*/}
      {/*  <React.Fragment>*/}
      {/*    <Link href="/login">Login</Link>*/}
      {/*    <Link href="/create-account">Create Account</Link>*/}
      {/*  </React.Fragment>*/}
      {/*)}*/}
    </nav>
  )
}

function HamburgerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 15 15">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M1.5 3a.5.5 0 000 1h12a.5.5 0 000-1h-12zM1 7.5a.5.5 0 01.5-.5h12a.5.5 0 010 1h-12a.5.5 0 01-.5-.5zm0 4a.5.5 0 01.5-.5h12a.5.5 0 010 1h-12a.5.5 0 01-.5-.5z"
        clipRule="evenodd"
      ></path>
    </svg>
  )
}
