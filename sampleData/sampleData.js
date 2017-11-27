// This file shows the format of data that comes back from Yelp

const rawDataYelp = [
  {
    'id': 'fog-harbor-fish-house-san-francisco-2',
    'name': 'Fog Harbor Fish House',
    'image_url': 'https://s3-media1.fl.yelpcdn.com/bphoto/DemnQQ9M05jXzjD_cxF81A/o.jpg',
    'is_closed': false,
    'url': 'https://www.yelp.com/biz/fog-harbor-fish-house-san-francisco-2?adjust_creative=rvexlWGWfhIn-9lICYTnNA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=rvexlWGWfhIn-9lICYTnNA',
    'review_count': 3667,
    'categories': [
        {
            'alias': 'seafood',
            'title': 'Seafood',
        },
        {
            'alias': 'bars',
            'title': 'Bars',
        },
    ],
    'rating': 4,
    'coordinates': {
        'latitude': 37.80873,
        'longitude': -122.410428,
    },
    'transactions': [],
    'price': '$$',
    'location': {
        'address1': 'Pier 39',
        'address2': 'Ste A-202',
        'address3': '',
        'city': 'San Francisco',
        'zip_code': '94133',
        'country': 'US',
        'state': 'CA',
        'display_address': [
            'Pier 39',
            'Ste A-202',
            'San Francisco, CA 94133',
        ],
    },
    'phone': '+14154212442',
    'display_phone': '(415) 421-2442',
    'distance': 5789.203322139542,
  },
  {
    'id': 'the-house-san-francisco',
    'name': 'The House',
    'image_url': 'https://s3-media3.fl.yelpcdn.com/bphoto/K48sSeIuHURatMBrSTfOTg/o.jpg',
    'is_closed': false,
    'url': 'https://www.yelp.com/biz/the-house-san-francisco?adjust_creative=rvexlWGWfhIn-9lICYTnNA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=rvexlWGWfhIn-9lICYTnNA',
    'review_count': 4132,
    'categories': [
        {
            'alias': 'asianfusion',
            'title': 'Asian Fusion',
        },
    ],
    'rating': 4.5,
    'coordinates': {
        'latitude': 37.7986203,
        'longitude': -122.4070251,
    },
    'transactions': [
        'restaurant_reservation',
    ],
    'price': '$$$',
    'location': {
        'address1': '1230 Grant Ave',
        'address2': '',
        'address3': '',
        'city': 'San Francisco',
        'zip_code': '94133',
        'country': 'US',
        'state': 'CA',
        'display_address': [
            '1230 Grant Ave',
            'San Francisco, CA 94133',
        ],
    },
    'phone': '+14159868612',
    'display_phone': '(415) 986-8612',
    'distance': 4911.92893166815,
  },
  {
    'id': 'brendas-french-soul-food-san-francisco',
    'name': 'Brenda\'s French Soul Food',
    'image_url': 'https://s3-media1.fl.yelpcdn.com/bphoto/YT8ho02lCT6Ubu3vx8uCaw/o.jpg',
    'is_closed': false,
    'url': 'https://www.yelp.com/biz/brendas-french-soul-food-san-francisco?adjust_creative=rvexlWGWfhIn-9lICYTnNA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=rvexlWGWfhIn-9lICYTnNA',
    'review_count': 8471,
    'categories': [
        {
            'alias': 'breakfast_brunch',
            'title': 'Breakfast & Brunch',
        },
        {
            'alias': 'french',
            'title': 'French',
        },
        {
            'alias': 'soulfood',
            'title': 'Soul Food',
        },
    ],
    'rating': 4,
    'coordinates': {
        'latitude': 37.7829016035273,
        'longitude': -122.419043442957,
    },
    'transactions': [],
    'price': '$$',
    'location': {
        'address1': '652 Polk St',
        'address2': '',
        'address3': '',
        'city': 'San Francisco',
        'zip_code': '94102',
        'country': 'US',
        'state': 'CA',
        'display_address': [
            '652 Polk St',
            'San Francisco, CA 94102',
        ],
    },
    'phone': '+14153458100',
    'display_phone': '(415) 345-8100',
    'distance': 2885.389130953204,
  },
  {
    'id': 'hog-island-oyster-co-san-francisco',
    'name': 'Hog Island Oyster Co',
    'image_url': 'https://s3-media2.fl.yelpcdn.com/bphoto/lm8OpdFI1UrHrI0bN074iA/o.jpg',
    'is_closed': false,
    'url': 'https://www.yelp.com/biz/hog-island-oyster-co-san-francisco?adjust_creative=rvexlWGWfhIn-9lICYTnNA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=rvexlWGWfhIn-9lICYTnNA',
    'review_count': 4628,
    'categories': [
        {
            'alias': 'seafood',
            'title': 'Seafood',
        },
        {
            'alias': 'seafoodmarkets',
            'title': 'Seafood Markets',
        },
        {
            'alias': 'raw_food',
            'title': 'Live/Raw Food',
        },
    ],
    'rating': 4.5,
    'coordinates': {
        'latitude': 37.795831,
        'longitude': -122.393303,
    },
    'transactions': [
        'restaurant_reservation',
    ],
    'price': '$$',
    'location': {
        'address1': '1 Ferry Bldg',
        'address2': '',
        'address3': 'Shop 11',
        'city': 'San Francisco',
        'zip_code': '94111',
        'country': 'US',
        'state': 'CA',
        'display_address': [
            '1 Ferry Bldg',
            'Shop 11',
            'San Francisco, CA 94111',
        ],
    },
    'phone': '+14153917117',
    'display_phone': '(415) 391-7117',
    'distance': 5428.156706690052,
  },
];

module.exports = {
  rawDataYelp,
};
