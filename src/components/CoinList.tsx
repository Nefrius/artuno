'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import CoinImage from './CoinImage'

interface Coin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  market_cap_rank: number
}

interface CoinListProps {
  coins: Coin[]
}

export default function CoinList({ coins }: CoinListProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(price)
  }

  const formatMarketCap = (marketCap: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(marketCap)
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow-lg bg-white">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              #
            </th>
            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Kripto Para
            </th>
            <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Fiyat
            </th>
            <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
              24s Değişim
            </th>
            <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Piyasa Değeri
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {coins.map((coin) => (
            <motion.tr
              key={coin.id}
              whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.8)' }}
              className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                {coin.market_cap_rank}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link href={`/analysis/${coin.id}`} className="flex items-center group">
                  <div className="flex-shrink-0">
                    <CoinImage src={coin.image} name={coin.name} size="sm" className="group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                      {coin.name}
                    </div>
                    <div className="text-sm text-gray-500 uppercase group-hover:text-indigo-400 transition-colors duration-200">
                      {coin.symbol}
                    </div>
                  </div>
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {formatPrice(coin.current_price)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  coin.price_change_percentage_24h >= 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {formatMarketCap(coin.market_cap)}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 