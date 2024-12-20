import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom'

export function NotFound() {
  const [funFact, setFunFact] = useState('')

  useEffect(() => {
    fetchFunFact()
  }, [])

  const fetchFunFact = async () => {
    try {
      const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en')
      const data = await response.json()
      setFunFact(data.text)
    } catch (error) {
      console.error('Error fetching fun fact:', error)
      setFunFact('Did you know that errors can be fun too?')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-200 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-9xl font-bold text-purple-600 mb-8"
      >
        404
      </motion.div>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops! Page Not Found</h1>
      <p className="text-xl text-gray-600 mb-8">It seems you've ventured into uncharted territory!</p>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 mb-8"
      >
        <h2 className="text-2xl font-semibold mb-4">While you're here, enjoy a random fun fact:</h2>
        <p className="text-gray-700 italic">&ldquo;{funFact}&rdquo;</p>
      </motion.div>
      <Button variant="outline" asChild className="mt-4">
        <Link to="/">Return to Home</Link>
      </Button>
    </div>
  )
}

