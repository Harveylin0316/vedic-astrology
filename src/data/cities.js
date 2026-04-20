// 常用城市資料（經緯度 + 標準時區）
// 選城市會自動填入 lat/lon/tz，不需使用者手動輸入
// 注：海外城市 tz 使用「標準時間」（冬令），若當事人在夏令時出生須手動微調

export const cities = [
  // 台灣 Taiwan
  { name: '台北', display: '台北 Taipei', lat: 25.0478, lon: 121.5319, tz: 8 },
  { name: '新北', display: '新北 New Taipei', lat: 25.0127, lon: 121.4650, tz: 8 },
  { name: '基隆', display: '基隆 Keelung', lat: 25.1276, lon: 121.7392, tz: 8 },
  { name: '桃園', display: '桃園 Taoyuan', lat: 24.9936, lon: 121.3010, tz: 8 },
  { name: '新竹', display: '新竹 Hsinchu', lat: 24.8138, lon: 120.9675, tz: 8 },
  { name: '苗栗', display: '苗栗 Miaoli', lat: 24.5602, lon: 120.8214, tz: 8 },
  { name: '台中', display: '台中 Taichung', lat: 24.1477, lon: 120.6736, tz: 8 },
  { name: '彰化', display: '彰化 Changhua', lat: 24.0732, lon: 120.5437, tz: 8 },
  { name: '南投', display: '南投 Nantou', lat: 23.9157, lon: 120.6869, tz: 8 },
  { name: '雲林', display: '雲林 Yunlin', lat: 23.7092, lon: 120.4313, tz: 8 },
  { name: '嘉義', display: '嘉義 Chiayi', lat: 23.4801, lon: 120.4491, tz: 8 },
  { name: '台南', display: '台南 Tainan', lat: 22.9999, lon: 120.2270, tz: 8 },
  { name: '高雄', display: '高雄 Kaohsiung', lat: 22.6273, lon: 120.3014, tz: 8 },
  { name: '屏東', display: '屏東 Pingtung', lat: 22.6725, lon: 120.4937, tz: 8 },
  { name: '宜蘭', display: '宜蘭 Yilan', lat: 24.7021, lon: 121.7378, tz: 8 },
  { name: '花蓮', display: '花蓮 Hualien', lat: 23.9871, lon: 121.6015, tz: 8 },
  { name: '台東', display: '台東 Taitung', lat: 22.7583, lon: 121.1444, tz: 8 },
  { name: '澎湖', display: '澎湖 Penghu', lat: 23.5712, lon: 119.5795, tz: 8 },
  { name: '金門', display: '金門 Kinmen', lat: 24.4493, lon: 118.3769, tz: 8 },
  { name: '馬祖', display: '馬祖 Matsu', lat: 26.1580, lon: 119.9498, tz: 8 },

  // 中國大陸 China
  { name: '北京', display: '北京 Beijing', lat: 39.9042, lon: 116.4074, tz: 8 },
  { name: '上海', display: '上海 Shanghai', lat: 31.2304, lon: 121.4737, tz: 8 },
  { name: '深圳', display: '深圳 Shenzhen', lat: 22.5431, lon: 114.0579, tz: 8 },
  { name: '廣州', display: '廣州 Guangzhou', lat: 23.1291, lon: 113.2644, tz: 8 },
  { name: '成都', display: '成都 Chengdu', lat: 30.5728, lon: 104.0668, tz: 8 },
  { name: '重慶', display: '重慶 Chongqing', lat: 29.4316, lon: 106.9123, tz: 8 },
  { name: '杭州', display: '杭州 Hangzhou', lat: 30.2741, lon: 120.1551, tz: 8 },
  { name: '南京', display: '南京 Nanjing', lat: 32.0603, lon: 118.7969, tz: 8 },
  { name: '武漢', display: '武漢 Wuhan', lat: 30.5928, lon: 114.3055, tz: 8 },
  { name: '西安', display: '西安 Xian', lat: 34.3416, lon: 108.9398, tz: 8 },
  { name: '天津', display: '天津 Tianjin', lat: 39.3434, lon: 117.3616, tz: 8 },
  { name: '青島', display: '青島 Qingdao', lat: 36.0671, lon: 120.3826, tz: 8 },
  { name: '廈門', display: '廈門 Xiamen', lat: 24.4798, lon: 118.0894, tz: 8 },
  { name: '蘇州', display: '蘇州 Suzhou', lat: 31.2989, lon: 120.5853, tz: 8 },

  // 港澳 HK / Macau
  { name: '香港', display: '香港 Hong Kong', lat: 22.3193, lon: 114.1694, tz: 8 },
  { name: '澳門', display: '澳門 Macau', lat: 22.1987, lon: 113.5439, tz: 8 },

  // 亞洲 Asia
  { name: '東京', display: '東京 Tokyo', lat: 35.6762, lon: 139.6503, tz: 9 },
  { name: '大阪', display: '大阪 Osaka', lat: 34.6937, lon: 135.5023, tz: 9 },
  { name: '首爾', display: '首爾 Seoul', lat: 37.5665, lon: 126.9780, tz: 9 },
  { name: '新加坡', display: '新加坡 Singapore', lat: 1.3521, lon: 103.8198, tz: 8 },
  { name: '曼谷', display: '曼谷 Bangkok', lat: 13.7563, lon: 100.5018, tz: 7 },
  { name: '吉隆坡', display: '吉隆坡 Kuala Lumpur', lat: 3.1390, lon: 101.6869, tz: 8 },
  { name: '馬尼拉', display: '馬尼拉 Manila', lat: 14.5995, lon: 120.9842, tz: 8 },
  { name: '雅加達', display: '雅加達 Jakarta', lat: -6.2088, lon: 106.8456, tz: 7 },

  // 北美 North America（冬令標準時區，夏令用戶請 -1）
  { name: '紐約', display: '紐約 New York', lat: 40.7128, lon: -74.0060, tz: -5 },
  { name: '洛杉磯', display: '洛杉磯 Los Angeles', lat: 34.0522, lon: -118.2437, tz: -8 },
  { name: '舊金山', display: '舊金山 San Francisco', lat: 37.7749, lon: -122.4194, tz: -8 },
  { name: '西雅圖', display: '西雅圖 Seattle', lat: 47.6062, lon: -122.3321, tz: -8 },
  { name: '芝加哥', display: '芝加哥 Chicago', lat: 41.8781, lon: -87.6298, tz: -6 },
  { name: '休士頓', display: '休士頓 Houston', lat: 29.7604, lon: -95.3698, tz: -6 },
  { name: '波士頓', display: '波士頓 Boston', lat: 42.3601, lon: -71.0589, tz: -5 },
  { name: '溫哥華', display: '溫哥華 Vancouver', lat: 49.2827, lon: -123.1207, tz: -8 },
  { name: '多倫多', display: '多倫多 Toronto', lat: 43.6532, lon: -79.3832, tz: -5 },

  // 歐洲 Europe
  { name: '倫敦', display: '倫敦 London', lat: 51.5074, lon: -0.1278, tz: 0 },
  { name: '巴黎', display: '巴黎 Paris', lat: 48.8566, lon: 2.3522, tz: 1 },
  { name: '柏林', display: '柏林 Berlin', lat: 52.5200, lon: 13.4050, tz: 1 },
  { name: '阿姆斯特丹', display: '阿姆斯特丹 Amsterdam', lat: 52.3676, lon: 4.9041, tz: 1 },
  { name: '羅馬', display: '羅馬 Rome', lat: 41.9028, lon: 12.4964, tz: 1 },
  { name: '馬德里', display: '馬德里 Madrid', lat: 40.4168, lon: -3.7038, tz: 1 },

  // 大洋洲 Oceania
  { name: '雪梨', display: '雪梨 Sydney', lat: -33.8688, lon: 151.2093, tz: 10 },
  { name: '墨爾本', display: '墨爾本 Melbourne', lat: -37.8136, lon: 144.9631, tz: 10 },
  { name: '布里斯本', display: '布里斯本 Brisbane', lat: -27.4698, lon: 153.0251, tz: 10 },
  { name: '奧克蘭', display: '奧克蘭 Auckland', lat: -36.8485, lon: 174.7633, tz: 12 }
]

// 快查：名稱 → 資料
const cityMap = cities.reduce((acc, c) => {
  acc[c.name] = c
  acc[c.display] = c
  return acc
}, {})

export function findCity(query) {
  if (!query) return null
  const q = query.trim()
  return cityMap[q] || null
}
