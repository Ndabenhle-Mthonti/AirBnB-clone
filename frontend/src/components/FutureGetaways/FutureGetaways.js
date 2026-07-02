/**
 * FutureGetaways.js
 * -----------------
 * "Inspiration for future getaways" — tabbed list of South African destinations.
 *
 * Beginner notes:
 *  - TAB_DATA holds each tab label and its destinations.
 *  - useState tracks which tab is active.
 *  - Clicking a tab swaps the destination list below.
 */

import { useState } from 'react'
import './FutureGetaways.css'

const TAB_DATA = [
  {
    tabLabel: 'Destinations for arts and culture',
    destinations: [
      { landmark: 'District Six Museum', location: 'Cape Town, Western Cape' },
      { landmark: 'Constitution Hill', location: 'Johannesburg, Gauteng' },
      { landmark: 'Nelson Mandela Capture Site', location: 'Howick, KwaZulu-Natal' },
      { landmark: 'Apartheid Museum', location: 'Johannesburg, Gauteng' },
      { landmark: 'Robben Island', location: 'Cape Town, Western Cape' },
      { landmark: 'Origins Centre', location: 'Johannesburg, Gauteng' },
      { landmark: 'Bo-Kaap', location: 'Cape Town, Western Cape' },
      { landmark: 'KwaZulu-Natal Museum', location: 'Pietermaritzburg, KwaZulu-Natal' },
      { landmark: 'Freedom Park', location: 'Pretoria, Gauteng' },
      { landmark: 'Standard Bank Gallery', location: 'Johannesburg, Gauteng' },
      { landmark: 'Iziko South African Museum', location: 'Cape Town, Western Cape' },
      { landmark: 'Msunduzi Museum', location: 'Pietermaritzburg, KwaZulu-Natal' },
    ],
  },
  {
    tabLabel: 'Destinations for outdoor adventure',
    destinations: [
      { landmark: 'Table Mountain', location: 'Cape Town, Western Cape' },
      { landmark: 'Blyde River Canyon', location: 'Mpumalanga' },
      { landmark: 'Tsitsikamma Forest', location: 'Garden Route, Western Cape' },
      { landmark: 'Drakensberg Amphitheatre', location: 'KwaZulu-Natal' },
      { landmark: 'Storms River Mouth', location: 'Eastern Cape' },
      { landmark: 'Sani Pass', location: 'Underberg, KwaZulu-Natal' },
      { landmark: 'Cape Point', location: 'Cape Town, Western Cape' },
      { landmark: 'Golden Gate Highlands', location: 'Free State' },
      { landmark: 'Addo Elephant Park', location: 'Eastern Cape' },
      { landmark: 'Oribi Gorge', location: 'KwaZulu-Natal' },
      { landmark: 'Wild Coast', location: 'Eastern Cape' },
      { landmark: 'Pilanesberg National Park', location: 'North West' },
    ],
  },
  {
    tabLabel: 'Mountain cabins',
    destinations: [
      { landmark: 'Drakensberg', location: 'KwaZulu-Natal' },
      { landmark: 'Hogsback', location: 'Eastern Cape' },
      { landmark: 'Dullstroom', location: 'Mpumalanga' },
      { landmark: 'Cederberg', location: 'Western Cape' },
      { landmark: 'Magoebaskloof', location: 'Limpopo' },
      { landmark: 'Sabie', location: 'Mpumalanga' },
      { landmark: 'Franschhoek Mountains', location: 'Western Cape' },
      { landmark: 'Rhodes', location: 'Eastern Cape' },
      { landmark: 'Clarens', location: 'Free State' },
      { landmark: 'Swartberg', location: 'Western Cape' },
      { landmark: 'Karkloof', location: 'KwaZulu-Natal' },
      { landmark: 'Waterval Boven', location: 'Mpumalanga' },
    ],
  },
  {
    tabLabel: 'Beach destinations',
    destinations: [
      { landmark: 'Camps Bay', location: 'Cape Town, Western Cape' },
      { landmark: 'Umhlanga Rocks', location: 'KwaZulu-Natal' },
      { landmark: 'Ballito', location: 'KwaZulu-Natal' },
      { landmark: 'Plettenberg Bay', location: 'Western Cape' },
      { landmark: 'Jeffreys Bay', location: 'Eastern Cape' },
      { landmark: 'Umdloti', location: 'KwaZulu-Natal' },
      { landmark: 'Hermanus', location: 'Western Cape' },
      { landmark: 'Margate', location: 'KwaZulu-Natal' },
      { landmark: 'Knysna', location: 'Western Cape' },
      { landmark: 'St Francis Bay', location: 'Eastern Cape' },
      { landmark: 'Mossel Bay', location: 'Western Cape' },
      { landmark: 'Scottburgh', location: 'KwaZulu-Natal' },
    ],
  },
  {
    tabLabel: 'Popular destinations',
    destinations: [
      { landmark: 'Cape Town', location: 'Western Cape' },
      { landmark: 'Johannesburg', location: 'Gauteng' },
      { landmark: 'Durban', location: 'KwaZulu-Natal' },
      { landmark: 'Pretoria', location: 'Gauteng' },
      { landmark: 'Stellenbosch', location: 'Western Cape' },
      { landmark: 'Port Elizabeth', location: 'Eastern Cape' },
      { landmark: 'Kruger National Park', location: 'Mpumalanga' },
      { landmark: 'Knysna', location: 'Western Cape' },
      { landmark: 'Bloemfontein', location: 'Free State' },
      { landmark: 'Sun City', location: 'North West' },
      { landmark: 'Pietermaritzburg', location: 'KwaZulu-Natal' },
      { landmark: 'George', location: 'Western Cape' },
    ],
  },
  {
    tabLabel: 'Unique stays',
    destinations: [
      { landmark: 'Shipwreck Lodge', location: 'West Coast, Western Cape' },
      { landmark: 'Ngwenya Glass Village', location: 'Mpumalanga' },
      { landmark: 'Kagga Kamma', location: 'Cederberg, Western Cape' },
      { landmark: 'Tented Camps', location: 'Sabi Sands, Mpumalanga' },
      { landmark: 'Cape Dutch Farmhouses', location: 'Franschhoek, Western Cape' },
      { landmark: 'Treehouse Lodges', location: 'Magoebaskloof, Limpopo' },
      { landmark: 'Houseboats', location: 'Vaal Dam, Gauteng' },
      { landmark: 'Desert Cabins', location: 'Karoo, Northern Cape' },
      { landmark: 'Cliffside Villas', location: 'Wild Coast, Eastern Cape' },
      { landmark: 'Wine Estate Cottages', location: 'Stellenbosch, Western Cape' },
      { landmark: 'Safari Tents', location: 'Pilanesberg, North West' },
      { landmark: 'Beach Chalets', location: 'Umhlanga, KwaZulu-Natal' },
    ],
  },
]

function FutureGetaways({ tabs = TAB_DATA }) {
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  const activeTab = tabs[activeTabIndex]

  return (
    <section className="future-getaways" aria-label="Future getaways inspiration">
      <h2 className="future-getaways__heading">Inspiration for future getaways</h2>

      <div className="future-getaways__tabs" role="tablist" aria-label="Destination categories">
        {tabs.map((tab, index) => (
          <button
            key={tab.tabLabel}
            type="button"
            role="tab"
            aria-selected={activeTabIndex === index}
            className={`future-getaways__tab ${
              activeTabIndex === index ? 'future-getaways__tab--active' : ''
            }`}
            onClick={() => setActiveTabIndex(index)}
          >
            {tab.tabLabel}
          </button>
        ))}
      </div>

      <div
        className="future-getaways__grid"
        role="tabpanel"
        aria-label={activeTab.tabLabel}
      >
        {activeTab.destinations.map((destination) => (
          <div
            key={`${activeTab.tabLabel}-${destination.landmark}`}
            className="future-getaways__item"
          >
            <p className="future-getaways__landmark">{destination.landmark}</p>
            <p className="future-getaways__location">{destination.location}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FutureGetaways
