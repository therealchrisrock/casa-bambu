import React from 'react'
import { Button } from 'payload/components/elements'
import { useConfig } from 'payload/components/utilities'

type Props = {}
const BeforeNavLinks = (props: Props) => {
  const currentPath = ''

  const {
    routes: { admin: adminRoute },
  } = useConfig()

  const links = [
    {
      title: 'Calendar',
      url: '/calendar',
    },
    // {
    // 	title: "My Appointments Schedule",
    // 	url: "/appointments-schedule/me",
    // },
  ]

  return (
    <>
      {links.map(link => (
        <Button el="link" buttonStyle="none" className={'nav-group'} to={adminRoute + link.url} key={link.url}>
          {link.title}
        </Button>
      ))}
    </>
  )
}
export default BeforeNavLinks
