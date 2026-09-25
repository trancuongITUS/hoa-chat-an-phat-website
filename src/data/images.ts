/**
 * Ảnh minh hoạ đang dùng trên site — sinh từ `assets/raw-images/image-map.json`.
 *
 * Toàn bộ là ảnh có giấy phép tự do (CC0, public domain, CC BY, CC BY-SA) lấy từ Wikimedia
 * Commons, chưa phải ảnh chụp tại An Phát. Ảnh kho, xe và văn phòng chỉ để dựng bố cục; khi có
 * ảnh thật thì thay `src`, kích thước và `credit` của mục tương ứng. Vị trí nào không có ảnh ở
 * đây sẽ tự hiện `PlaceholderImage`.
 *
 * CC BY và CC BY-SA bắt buộc ghi tác giả, giấy phép và nêu chỉnh sửa — trang `/nguon-anh`
 * dựng từ trường `credit`, nên mọi ảnh thêm vào đây phải có đủ trường này.
 */

export interface ImageCredit {
  title: string
  author: string
  license: string
  licenseUrl?: string
  sourceUrl: string
  /** Chỉnh sửa đã áp dụng lên ảnh gốc, bắt buộc nêu với CC BY-SA. */
  changes: string
}

export interface SiteImage {
  src: string
  width: number
  height: number
  alt: string
  /** Giá trị `object-position` để giữ phần quan trọng khi khung cắt ảnh. */
  position?: string
  credit: ImageCredit
}

export const SITE_IMAGES = {
  homeHero: {
    src: '/images/hero/home-hero.webp',
    width: 2400,
    height: 1146,
    alt: 'Cụm bồn chứa lớn và cầu ống kỹ thuật trong khu công nghiệp',
    credit: {
      title: 'Lahad-Datu Sabah Mewah-Datu-Sdn-Bhd-02.jpg',
      author: 'CEphoto, Uwe Aranas',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Lahad-Datu_Sabah_Mewah-Datu-Sdn-Bhd-02.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  capabilityWarehouse: {
    src: '/images/capabilities/capability-warehouse.webp',
    width: 1000,
    height: 563,
    alt: 'Phuy thép chứa hoá chất xếp chồng ngay ngắn trong kho',
    credit: {
      title: 'Jumbo Plastic Galvanized steel drum 545665 4b.jpg',
      author: 'Ymsoncincor',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Jumbo_Plastic_Galvanized_steel_drum_545665_4b.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  capabilityTankerTruck: {
    src: '/images/capabilities/capability-tanker-truck.webp',
    width: 1000,
    height: 750,
    alt: 'Xe bồn chở hoá chất có biển cảnh báo hàng nguy hiểm',
    position: '50% 55%',
    credit: {
      title: 'Hazardous chemical tanker truck - 皖R07320.jpg',
      author: 'Fumikas Sagisavas',
      license: 'CC0',
      licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hazardous_chemical_tanker_truck_-_%E7%9A%96R07320.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  capabilityQualityControl: {
    src: '/images/capabilities/capability-quality-control.webp',
    width: 1000,
    height: 1333,
    alt: 'Kỹ thuật viên đo tỉ trọng mẫu hoá chất bằng tỷ trọng kế trong ống đong',
    position: '50% 65%',
    credit: {
      title: 'Laboratory Hydrometer test.jpg',
      author: 'Maame1Yaa',
      license: 'CC0',
      licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Laboratory_Hydrometer_test.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  aboutOfficeWarehouse: {
    src: '/images/about/about-office-warehouse.webp',
    width: 1000,
    height: 585,
    alt: 'Khu văn phòng và nhà kho trong khu công nghiệp',
    position: '35% 50%',
    credit: {
      title: 'Yen Binh Industrial Park TS.jpg',
      author: 'Bacthai20',
      license: 'CC0',
      licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Yen_Binh_Industrial_Park_TS.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
} satisfies Record<string, SiteImage>

/** Ảnh sản phẩm theo slug — dùng chung cho thẻ và trang chi tiết. */
export const PRODUCT_IMAGES: Partial<Record<string, SiteImage>> = {
  'axit-sulfuric-98': {
    src: '/images/products/axit-sulfuric-98.webp',
    width: 660,
    height: 932,
    alt: 'Chai thủy tinh chứa axit sulfuric đậm đặc dạng lỏng không màu',
    credit: {
      title: 'Sulphuric acid 96 percent extra pure.jpg',
      author: 'W. Oelen',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sulphuric_acid_96_percent_extra_pure.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'xut-vay-naoh-99': {
    src: '/images/products/xut-vay-naoh-99.webp',
    width: 1000,
    height: 794,
    alt: 'Xút NaOH dạng hạt màu trắng trong đĩa thủy tinh',
    credit: {
      title: 'SodiumHydroxide.jpg',
      author: 'Walkerma',
      license: 'Public domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:SodiumHydroxide.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'axit-clohydric-32': {
    src: '/images/products/axit-clohydric-32.webp',
    width: 1000,
    height: 1494,
    alt: 'Axit clohydric dạng lỏng trong suốt trong ống đong thủy tinh',
    credit: {
      title: 'Hydrochloric acid 30-33% by Danny S. - 001.jpg',
      author: 'Danny S.',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hydrochloric_acid_30-33%25_by_Danny_S._-_001.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'javen-naocl-10': {
    src: '/images/products/javen-naocl-10.webp',
    width: 1000,
    height: 563,
    alt: 'Bồn chứa dung dịch natri hypoclorit (nước Javen) trong nhà xưởng xử lý nước',
    credit: {
      title: 'Tanks (116577465).jpeg',
      author: 'Fusion',
      license: 'CC BY 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Tanks_(116577465).jpeg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'phen-nhom-al2so4-3': {
    src: '/images/products/phen-nhom-al2so4-3.webp',
    width: 776,
    height: 585,
    alt: 'Tinh thể phèn nhôm nhôm sunfat màu trắng',
    credit: {
      title: 'Aluminium sulfate crystals.JPG',
      author: 'Chemicalinterest',
      license: 'Public domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Aluminium_sulfate_crystals.JPG',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'hydro-peroxit-50': {
    src: '/images/products/hydro-peroxit-50.webp',
    width: 1000,
    height: 722,
    alt: 'Bồn ISO tank chở dung dịch hydro peroxit với biển cảnh báo UN 2014',
    credit: {
      title: 'Evonik Degussa 22T6 DWAU 000269 4.jpg',
      author: 'Col André Kritzinger',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Evonik_Degussa_22T6_DWAU_000269_4.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'axit-nitric-68': {
    src: '/images/products/axit-nitric-68.webp',
    width: 1000,
    height: 1971,
    alt: 'Chai thủy tinh chứa axit nitric đậm đặc dạng lỏng không màu',
    credit: {
      title: 'Nitric acid 70.jpg',
      author: 'Aleksander Sobolewski',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Nitric_acid_70.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'axit-photphoric-85': {
    src: '/images/products/axit-photphoric-85.webp',
    width: 800,
    height: 1000,
    alt: 'Can nhựa đựng axit photphoric 85% có nhãn cảnh báo ăn mòn',
    credit: {
      title: 'Fosforsyra.jpg',
      author: 'Kemikungen',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Fosforsyra.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'soda-ash-na2co3': {
    src: '/images/products/soda-ash-na2co3.webp',
    width: 1000,
    height: 561,
    alt: 'Bột soda ash natri cacbonat màu trắng trên đĩa',
    credit: {
      title: 'Natriumcarbonat 02.jpg',
      author: 'Geoprofi Lars',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Natriumcarbonat_02.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'natri-bicarbonat': {
    src: '/images/products/natri-bicarbonat.webp',
    width: 1000,
    height: 750,
    alt: 'Bột natri bicarbonat NaHCO₃ màu trắng trên đĩa thủy tinh',
    credit: {
      title: 'Sodium bicarbonate CN.JPG',
      author: 'Tszrkx',
      license: 'Public domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sodium_bicarbonate_CN.JPG',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'methanol': {
    src: '/images/products/methanol.webp',
    width: 1000,
    height: 1500,
    alt: 'Lọ thủy tinh chứa methanol tinh khiết dạng lỏng trong suốt',
    credit: {
      title: 'Methanol ethanol vials.jpg',
      author: 'DMacks',
      license: 'CC BY 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Methanol_ethanol_vials.jpg',
      changes: 'Cắt bỏ lọ ethanol bên phải, thu nhỏ và chuyển WebP',
    },
  },
  'ethanol-96': {
    src: '/images/products/ethanol-96.webp',
    width: 1000,
    height: 1425,
    alt: 'Chai thủy tinh chứa ethanol trong suốt, không màu',
    credit: {
      title: 'Sample of Absolute Ethanol.jpg',
      author: 'LHcheM',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sample_of_Absolute_Ethanol.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'toluen': {
    src: '/images/products/toluen.webp',
    width: 1000,
    height: 1328,
    alt: 'Ống nghiệm chứa toluen lỏng trong suốt, không màu',
    position: '50% 80%',
    credit: {
      title: 'Toluen.png',
      author: 'Saint concrete',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Toluen.png',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'axeton': {
    src: '/images/products/axeton.webp',
    width: 1000,
    height: 1427,
    alt: 'Lọ thủy tinh nút mài chứa axeton trong suốt, không màu',
    credit: {
      title: 'Sample of Acetone.jpg',
      author: 'LHcheM',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sample_of_Acetone.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'isopropyl-alcohol': {
    src: '/images/products/isopropyl-alcohol.webp',
    width: 1000,
    height: 1453,
    alt: 'Bình định mức thủy tinh chứa isopropyl alcohol (IPA) trong suốt, không màu',
    credit: {
      title: 'Isopropanol by Danny S.jpg',
      author: 'Danny S.',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Isopropanol_by_Danny_S.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'xylen': {
    src: '/images/products/xylen.webp',
    width: 1000,
    height: 1000,
    alt: 'Các chai thủy tinh chứa xylen (o-, m-, p-xylene) trên bàn thí nghiệm',
    credit: {
      title: 'Xylenes isomers.jpg',
      author: 'Luckytooth',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Xylenes_isomers.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'canxi-hypoclorit-70': {
    src: '/images/products/canxi-hypoclorit-70.webp',
    width: 1000,
    height: 750,
    alt: 'Hạt canxi hypoclorit màu trắng trên mặt kính đồng hồ',
    credit: {
      title: 'Calcium-Hypochlorite.jpg',
      author: 'CCPCIRAN',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Calcium-Hypochlorite.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'amoniac-25': {
    src: '/images/products/amoniac-25.webp',
    width: 1000,
    height: 1333,
    alt: 'Chai thủy tinh chứa dung dịch amoniac 25% trong suốt',
    credit: {
      title: 'Ammonia solution (25-28%).jpg',
      author: 'Leiem',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ammonia_solution_(25-28%25).jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'axit-axetic-99': {
    src: '/images/products/axit-axetic-99.webp',
    width: 1000,
    height: 1333,
    alt: 'Chai thủy tinh nâu đựng axit axetic băng có nhãn cảnh báo ăn mòn',
    credit: {
      title: 'Acetic acid winchester.JPG',
      author: 'Petaholmes (English Wikipedia)',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'http://creativecommons.org/licenses/by-sa/3.0/',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Acetic_acid_winchester.JPG',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'kali-hydroxit': {
    src: '/images/products/kali-hydroxit.webp',
    width: 1000,
    height: 883,
    alt: 'Vảy kali hydroxit KOH màu trắng trên mặt kính đồng hồ',
    credit: {
      title: 'Hydroxyde de potassium.JPG',
      author: 'Leiem',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hydroxyde_de_potassium.JPG',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'natri-metabisulfit': {
    src: '/images/products/natri-metabisulfit.webp',
    width: 465,
    height: 344,
    alt: 'Bột natri metabisulfit màu trắng trên mặt kính đồng hồ',
    credit: {
      title: 'Sodium metabisulfite.jpg',
      author: 'Walkerma',
      license: 'Public domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sodium_metabisulfite.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'dong-sunfat': {
    src: '/images/products/dong-sunfat.webp',
    width: 1000,
    height: 750,
    alt: 'Tinh thể đồng sunfat CuSO₄·5H₂O màu xanh lam trên nền trắng',
    credit: {
      title: 'Copper(II)-sulfate-pentahydrate-sample.jpg',
      author: 'Benjah-bmm27',
      license: 'Public domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Copper(II)-sulfate-pentahydrate-sample.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'niken-sunfat': {
    src: '/images/products/niken-sunfat.webp',
    width: 1000,
    height: 750,
    alt: 'Tinh thể niken sunfat NiSO₄·6H₂O màu xanh lục trên nền trắng',
    credit: {
      title: 'Nickel(II)-sulfate-hexahydrate-sample.jpg',
      author: 'Benjah-bmm27',
      license: 'Public domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Nickel(II)-sulfate-hexahydrate-sample.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'natri-clorua-cong-nghiep': {
    src: '/images/products/natri-clorua-cong-nghiep.webp',
    width: 1000,
    height: 665,
    alt: 'Tinh thể muối natri clorua hạt thô cận cảnh',
    credit: {
      title: 'Sodium chloride crystals.jpg',
      author: 'Stanislav.nevyhosteny',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sodium_chloride_crystals.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
}

/** Ảnh bìa bài viết theo slug. */
export const ARTICLE_COVERS: Partial<Record<string, SiteImage>> = {
  'chon-pac-hay-phen-nhom-cho-tram-xu-ly-nuoc-thai': {
    src: '/images/articles/chon-pac-hay-phen-nhom-cho-tram-xu-ly-nuoc-thai.webp',
    width: 1280,
    height: 960,
    alt: 'Nhà máy xử lý nước thải ở Đà Lạt với bể lắng tròn và các hạng mục xử lý giữa đồi xanh',
    position: '50% 75%',
    credit: {
      title: 'Wastewater Treatment Plant, Da Lat 02.jpg',
      author: 'Diane Selwyn',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Wastewater_Treatment_Plant,_Da_Lat_02.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'khu-clo-du-truoc-mang-ro': {
    src: '/images/articles/khu-clo-du-truoc-mang-ro.webp',
    width: 1280,
    height: 1707,
    alt: 'Gian lọc màng RO công nghiệp với các giàn ống áp lực xếp tầng và hệ đường ống lớn',
    position: '50% 35%',
    credit: {
      title: 'Reverse osmosis desalination plant.JPG',
      author: 'James Grellier',
      license: 'CC BY-SA 3.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Reverse_osmosis_desalination_plant.JPG',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'kiem-soat-ph-trong-nhuom-hoat-tinh': {
    src: '/images/articles/kiem-soat-ph-trong-nhuom-hoat-tinh.webp',
    width: 1280,
    height: 1707,
    alt: 'Máy nhuộm vải soft-flow bằng inox với tủ điều khiển nhiệt độ trong xưởng nhuộm',
    position: '50% 33%',
    credit: {
      title: 'Dyeing machines.jpg',
      author: 'RAJIVVASUDEV',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Dyeing_machines.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'an-phat-mo-kho-hai-phong': {
    src: '/images/articles/an-phat-mo-kho-hai-phong.webp',
    width: 1280,
    height: 853,
    alt: 'Tàu container cập cảng quốc tế Hải Phòng dưới các cẩu giàn bốc xếp',
    position: '50% 65%',
    credit: {
      title: 'Container Ship at the Hai Phong International Container Terminal 01.jpg',
      author: 'Nathan.cima',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Container_Ship_at_the_Hai_Phong_International_Container_Terminal_01.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'doc-hieu-phieu-an-toan-hoa-chat-msds': {
    src: '/images/articles/doc-hieu-phieu-an-toan-hoa-chat-msds.webp',
    width: 1280,
    height: 960,
    alt: 'Thân bồn chứa axit sunfuric với biển cảnh báo nguy hiểm UN 1831 loại 8 chất ăn mòn',
    position: '50% 35%',
    credit: {
      title: 'Improperly labeled sulfuric acid tank car 2.jpg',
      author: 'Catherine C. Beaucham',
      license: 'Public domain',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Improperly_labeled_sulfuric_acid_tank_car_2.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'bo-tri-kho-hoa-chat-tach-nhom-tuong-ky': {
    src: '/images/articles/bo-tri-kho-hoa-chat-tach-nhom-tuong-ky.webp',
    width: 1280,
    height: 720,
    alt: 'Container kho chứa hoá chất nguy hại có biển cảnh báo và bình rửa mắt, kỹ sư đang kiểm tra',
    credit: {
      title: 'Bodega Residuos Peligrosos F120.jpg',
      author: 'Fclaveld',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bodega_Residuos_Peligrosos_F120.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'luu-tru-hydro-peroxit-dung-cach': {
    src: '/images/articles/luu-tru-hydro-peroxit-dung-cach.webp',
    width: 1280,
    height: 720,
    alt: 'Công nhân sang chiết hydro peroxit từ toa xe bồn sang xe bồn inox mang biển UN 2014',
    credit: {
      title: 'Servicing a Hydrogen Peroxide Tank Car.jpg',
      author: 'Niklaus Yager',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Servicing_a_Hydrogen_Peroxide_Tank_Car.jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
  'chon-dung-moi-tay-rua-cho-xuong-co-khi': {
    src: '/images/articles/chon-dung-moi-tay-rua-cho-xuong-co-khi.webp',
    width: 1280,
    height: 853,
    alt: 'Xưởng cơ khí với bàn nguội, ê tô và dãy máy tiện dọc lối đi',
    credit: {
      title: 'NOIRLab HQ Machine Shop (6V6A0724-CC).jpg',
      author: 'NOIRLab/NSF/AURA/T. Slovinský',
      license: 'CC BY 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by/4.0',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:NOIRLab_HQ_Machine_Shop_(6V6A0724-CC).jpg',
      changes: 'Thu nhỏ và chuyển sang WebP',
    },
  },
}
