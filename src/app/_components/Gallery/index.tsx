'use client'
import { useEffect, useRef, useState } from 'react'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { ChevronLeft, GripHorizontalIcon, ShareIcon } from 'lucide-react'

import { Product } from '../../../payload/payload-types'

import { Media } from '@/_components/Media'
import { Button } from '@/_components/ui/button'

export function Gallery({ assets }: { assets: Product['gallery'] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)

  const openModal = index => {
    setSelectedImageIndex(index)
    setIsOpen(true)
    disableBodyScroll(document.body)
  }

  const closeModal = () => {
    setIsOpen(false)
    enableBodyScroll(document.body)
  }

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const imageElement = modalRef.current.querySelector(`#image-${selectedImageIndex}`)
      const modalHeight = modalRef.current.clientHeight
      if (imageElement instanceof HTMLElement) {
        const imageOffsetTop = imageElement.offsetTop
        const scrollPosition = imageOffsetTop - modalHeight / 2 + imageElement.clientHeight / 2
        modalRef.current.scrollTo({ top: scrollPosition, behavior: 'smooth' })
      }
    }
  }, [isOpen, selectedImageIndex])
  return (
    <section className={'aspect-w-2'}>
      <div className="grid grid-cols-2 gap-2  rounded-lg overflow-hidden relative">
        <Button
          onClick={() => openModal(0)}
          variant={'outline'}
          className={'absolute bottom-2 right-2 z-10'}
        >
          <span className={'pr-2'}>Show All Photos</span> <GripHorizontalIcon />
        </Button>

        <div className="col-span-1">
          <Media
            priority={true}
            htmlElement={null}
            resource={assets[0].media}
            className={'w-full h-full object-cover cursor-pointer'}
            onClick={() => openModal(0)}
          />
        </div>
        <div className="col-span-1 grid grid-rows-2 grid-cols-2 gap-2">
          {assets.slice(1, 5).map((asset, index) => (
            <Media
              priority={true}
              htmlElement={null}
              resource={asset.media}
              key={asset.id || index}
              className={'w-full h-full object-cover cursor-pointer'}
              onClick={() => openModal(index + 1)}
            />
          ))}
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background bg-opacity-75 flex items-center justify-center">
          <div className="fixed top-0 left-0 right-0 bg-background p-4 flex justify-between items-center z-10">
            <button onClick={closeModal}>
              <ChevronLeft />
            </button>
            <button className="flex gap-2 items-center">
              <ShareIcon width={18} height={18} /> <span>Share</span>
            </button>
          </div>
          <div
            ref={modalRef}
            className="w-full h-full overflow-y-auto p-4 flex flex-col items-center pt-20"
          >
            <div className={'w-11/12 md:w-9/12 lg:w-8/12 max-w-[700px]'}>
              {assets.map((asset, index) => (
                <div id={`image-${index}`} key={asset.id || index} className="mb-4">
                  <Media
                    htmlElement={null}
                    resource={asset.media}
                    key={asset.id || index}
                    className="w-full h-auto object-contain rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
