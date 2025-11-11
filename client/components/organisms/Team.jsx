'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Team() {
  const team = [
    {
      name: 'MAHMOUD TURKOMANY',
      roles: ['FOUNDER','CREATIVE DIRECTOR'],
      image: '/team/Mahmoud.jpg',
    },
    {
      name: 'EKATER/NA BELIAEVA',
      roles: ['CEO', 'STRATEGIC PLANNING DIRECTOR'],
      image: '/team/Kate.jpg',
    }, 
    {
      name: 'BRAHMA SATYA CARYA',
      roles: ['ACCOUNT MANAGER'],
      image: '/team/Brahma.jpg',
    },
    {
      name: 'P/NGKAN',
      roles: ['CREATIVE DIRECTOR', 'GRAPHIC DESIGNER'],
      image: '/team/Pingkan.jpg',
    },
    {
      name: 'DEW/',
      roles: ['HUMAN RESOURCES AND GENERAL AFFAIRS'],
      image: '/team/Dewi.jpg',
    },
  ]

  return (
    <section className="w-full min-h-screen bg-white text-black px-20 py-24 flex flex-col lg:flex-row gap-16">
      {/* LEFT INTRO */}
      <div className="lg:w-1/3 flex items-start">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-left space-y-6"
        >
          <p className="text-3xl font-light leading-tight">
            <span className="text-2xl pr-3">→</span>
            Meet
            <br />
            our beloved
            <br />
            team
          </p>
        </motion.div>
      </div>

      {/* RIGHT GRID */}
      <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-20">
        {team.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.8 }}
            className="flex flex-col"
          >
            {/* Image */}
            <div className="relative w-full aspect-[4/5] overflow-hidden">
  <Image
    src={member.image}
    alt={member.name}
    fill
    className="object-cover object-[50%_20%] transition-transform duration-700 hover:scale-105"
  />
</div>


            {/* Info */}
            <div className="mt-4 border-b border-neutral-300 pb-4">
              <h3 className="text-lg font-medium tracking-wide">{member.name}</h3>
              <div className="mt-2 text-sm text-neutral-600 space-y-1">
                {member.roles.map((role, i) => (
                  <p key={i} className="tracking-widest uppercase">
                    {role}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
