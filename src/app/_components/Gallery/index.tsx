'use client'
import { useEffect, useRef, useState } from 'react'

import { Product } from '../../../payload/payload-types'

import { Media } from '@/_components/Media'
import { ChevronLeft, ShareIcon } from 'lucide-react'

export function Gallery({ assets }: { assets: Product['gallery'] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const modalRef = useRef(null)

  const openModal = index => {
    setSelectedImageIndex(index)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const imageElement = modalRef.current.querySelector(`#image-${selectedImageIndex}`)
      const modalHeight = modalRef.current.clientHeight
      const imageOffsetTop = imageElement.offsetTop
      const scrollPosition = imageOffsetTop - modalHeight / 2 + imageElement.clientHeight / 2
      modalRef.current.scrollTo({ top: scrollPosition, behavior: 'smooth' })
    }
  }, [isOpen, selectedImageIndex])
  return (
    <section className={'aspect-w-2 aspect-h-1'}>
      <div className="grid grid-cols-2 gap-2  rounded-lg overflow-hidden">
        <div className="col-span-1">
          <Media
            htmlElement={null}
            resource={assets[0].media}
            className={'w-full h-full object-cover'}
            onClick={() => openModal(0)}
          />
        </div>
        <div className="col-span-1 grid grid-rows-2 grid-cols-2 gap-2">
          {assets.slice(1, 5).map((asset, index) => (
            <Media
              htmlElement={null}
              resource={asset.media}
              key={asset.id || index}
              className={'w-full h-full object-cover'}
              onClick={() => openModal(index + 1)}
            />
          ))}
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background bg-opacity-75 flex items-center justify-center">
          <div className="fixed top-0 left-0 right-0 bg-background p-4 flex justify-between items-center z-10">
            <button
              onClick={closeModal}
            >
              <ChevronLeft />
            </button>
            <button
              className="flex gap-2 items-center"
            >
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
