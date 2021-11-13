import  InfiniteScroll from '../components/InfiniteScroll'
import React, { useState } from 'react'

let count = 0
const sleep = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(1)
    }, time)
  })
}

async function mockRequest() {
  if (count >= 8) {
    return []
  }
  await sleep(2000)
  count++
  return [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
  ].map(a => (a + count))
}
export interface IProps {
  fn: () => void
}

const Demo: React.FC<IProps> = (p) => {
  const [data, setData] = useState<string[]>([])
  const [hasMore, setHasMore] = useState(true)
  async function loadMore() {
    const append = await mockRequest()
    setData(val => [...val, ...append])
    setHasMore(append.length > 0)
  }
  const myRef = React.useRef({
    map: new Map()
  })
  console.log('myRef', myRef.current.map)

  return (
    <div id="box" style={{height: '500px', overflow: 'auto'}}>
      <button onClick={() => {
        console.log(myRef.current.map.size)
        myRef.current.map.set(Math.random() * 100, '1')
        const key = Math.random() 
        p.fn() 
      }}>add</button>
      <div className="box">
        {data.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
      {/* <InfiniteScroll loadMore={loadMore} hasMore={hasMore} /> */}
    </div>
  )
}

export default Demo