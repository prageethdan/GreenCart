import React from 'react'
import { assets, features } from '../assets/assets'

const Bottombanner = () => {
  return (
    <div className="relative mt-24">
      {/* Banner images */}
      <img src={assets.bottom_banner_image} alt="banner" className="w-full hidden md:block" />
      <img src={assets.bottom_banner_image_sm} alt="banner" className="w-full md:hidden" />

      {/* Content over banner */}
      <div className="absolute inset-0 right-0 flex flex-col items-center md:items-end md:justify-center pt-8 md:pt-0 md:pr-24">
        <div className="max-w-lg">
          {/* Heading */}
          <h1 className="text-2xl md:text-3xl font-semibold text-primary mb-8">
            Why we are the best?
          </h1>

          {/* Feature list */}
          <div className="flex flex-col gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-white/90 shadow-md rounded-xl hover:shadow-lg transition"
              >
                {/* Icon */}
                <img src={feature.icon} alt={feature.title} className="md:w-11 w-9 flex-shrink-0" />

                {/* Text */}
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 text-sm md:text-base leading-snug">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Bottombanner
