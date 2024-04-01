import * as fs from 'fs'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function populateNannys() {
  const data = fs.readFileSync('babysitters.json', 'utf8')
  const nannies = JSON.parse(data)

  for (const nannyData of nannies) {
    await prisma.nanny.create({
      data: {
        name: nannyData.name,
        avatarUrl: nannyData.avatar_url,
        birthday: new Date(nannyData.birthday),
        experience: nannyData.experience,
        education: nannyData.education,
        kidsAge: nannyData.kids_age,
        pricePerHour: nannyData.price_per_hour,
        location: nannyData.location,
        about: nannyData.about,
        rating: nannyData.rating,
        characters: nannyData.characters
      }
    })
  }

  console.log('Nannies seeded successfully!')
}

populateNannys()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
