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
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              #
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kripto Para
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fiyat
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              24s Değişim
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Piyasa Değeri
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {coins.map((coin) => (
            <motion.tr
              key={coin.id}
              whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.5)' }}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {coin.market_cap_rank}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link href={`/analysis/${coin.id}`} className="flex items-center">
                  <CoinImage src={coin.image} name={coin.name} size="sm" />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {coin.name}
                    </div>
                    <div className="text-sm text-gray-500 uppercase">
                      {coin.symbol}
                    </div>
                  </div>
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                {formatPrice(coin.current_price)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  coin.price_change_percentage_24h >= 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                {formatMarketCap(coin.market_cap)}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 