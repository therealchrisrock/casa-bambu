import React from 'react'
import Link from 'next/link'

import { Footer } from '../../../payload/payload-types'
import { fetchFooter, fetchGlobals } from '../../_api/fetchGlobals'
import { ThemeSelector } from '../../_providers/Theme/ThemeSelector'
import { Gutter } from '../Gutter'
import { CMSLink } from '../Link'

import classes from './index.module.scss'

export async function Footer() {
  let footer: Footer | null = null

  try {
    footer = await fetchFooter()
  } catch (error) {
    // When deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // So swallow the error here and simply render the footer without nav items if one occurs
    // in production you may want to redirect to a 404  page or at least log the error somewhere
    // console.error(error)
  }

  const navItems = footer?.navItems || []

  return (
    <footer className={classes.footer}>
      <Gutter className={classes.wrap}>
        <nav className={classes.nav}>
          {/*<ThemeSelector />*/}
          {navItems.map(({ link }, i) => {
            return <CMSLink appearance={'none'} key={i} {...link} />
          })}
        </nav>
        <img
          className={'w-48'}
          src={'/media/large-logo.png'}
          alt={
            'The logo of Casa Bambu, a company offering vacation rental properties in West Bay, Roatan, Honduras, featuring a stylized design with the company’s name in a modern, elegant font.'
          }
        />
      </Gutter>
    </footer>
  )
}
