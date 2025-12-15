import Link from 'next/link'

export default function FunShowcase() {
  const examples = [
    {
      owner: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      pet: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
      petName: 'Max',
      ownerName: 'Sarah',
    },
    {
      owner: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      pet: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400',
      petName: 'Whiskers',
      ownerName: 'John',
    },
    {
      owner: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      pet: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=400',
      petName: 'Buddy',
      ownerName: 'Emma',
    },
    {
      owner: 'https://images.pexels.com/photos/1310522/pexels-photo-1310522.jpeg?auto=compress&cs=tinysrgb&w=400',
      pet: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
      petName: 'Luna',
      ownerName: 'Michael',
    },
    {
      owner: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
      pet: 'https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg?auto=compress&cs=tinysrgb&w=400',
      petName: 'Charlie',
      ownerName: 'Jessica',
    },
    {
      owner: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      pet: 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=400',
      petName: 'Daisy',
      ownerName: 'David',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4">See The Magic!</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real pet parents + Their adorable pets = Hilarious cartoon twins!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examples.map((example, idx) => (
            <div
              key={idx}
              className="card hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="grid grid-cols-3 gap-2 mb-4">
                <img
                  src={example.owner}
                  alt="Owner"
                  className="rounded-lg w-full h-24 object-cover"
                />
                <div className="flex items-center justify-center">
                  <span className="text-3xl">+</span>
                </div>
                <img
                  src={example.pet}
                  alt="Pet"
                  className="rounded-lg w-full h-24 object-cover"
                />
              </div>
              <div className="text-center mb-3">
                <span className="text-2xl">✨</span>
                <span className="text-xl mx-2">=</span>
                <span className="text-2xl">😂</span>
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-coral-100 rounded-xl p-4 mb-3">
                <div className="text-center text-gray-600 font-medium">
                  Coming Soon: AI Generated Result
                </div>
              </div>
              <p className="text-center font-semibold text-purple-600">
                {example.ownerName} & {example.petName}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/create" className="btn-primary text-lg px-8 py-4 inline-block">
            Create Yours Now
          </Link>
        </div>
      </div>
    </section>
  )
}
