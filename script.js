// 全局变量
let children = [
    { id: 0, name: '大宝', birthday: '', gender: 'female' },
    { id: 1, name: '小宝', birthday: '', gender: 'female' }
];
let growthData = [];
let currentChart = null;
let editingChildIndex = null;
let confirmCallback = null;

// 中国标准身高参考数据（女童，单位：cm）
const chineseStandardHeightFemale = {
    0: { min: 46.1, avg: 50.0, max: 53.9 },
    1: { min: 49.4, avg: 53.5, max: 57.6 },
    2: { min: 52.2, avg: 57.0, max: 61.8 },
    3: { min: 54.4, avg: 60.1, max: 65.8 },
    4: { min: 56.5, avg: 62.9, max: 69.3 },
    5: { min: 58.4, avg: 65.5, max: 72.6 },
    6: { min: 60.2, avg: 67.9, max: 75.6 },
    7: { min: 61.8, avg: 70.2, max: 78.6 },
    8: { min: 63.4, avg: 72.4, max: 81.4 },
    9: { min: 65.0, avg: 74.5, max: 84.1 },
    10: { min: 66.6, avg: 76.6, max: 86.6 },
    11: { min: 68.2, avg: 78.6, max: 89.0 },
    12: { min: 69.8, avg: 80.5, max: 91.2 },
    13: { min: 71.4, avg: 82.4, max: 93.4 },
    14: { min: 73.0, avg: 84.2, max: 95.4 },
    15: { min: 74.6, avg: 85.9, max: 97.4 },
    16: { min: 76.2, avg: 87.6, max: 99.2 },
    17: { min: 77.8, avg: 89.3, max: 101.0 },
    18: { min: 79.4, avg: 90.8, max: 102.6 },
    19: { min: 80.9, avg: 92.3, max: 104.2 },
    20: { min: 82.4, avg: 93.8, max: 105.7 },
    21: { min: 83.9, avg: 95.2, max: 107.2 },
    22: { min: 85.3, avg: 96.5, max: 108.6 },
    23: { min: 86.7, avg: 97.8, max: 110.0 },
    24: { min: 88.0, avg: 99.0, max: 111.3 },
    25: { min: 89.3, avg: 100.2, max: 112.6 },
    26: { min: 90.6, avg: 101.4, max: 113.9 },
    27: { min: 91.8, avg: 102.6, max: 115.1 },
    28: { min: 93.0, avg: 103.7, max: 116.3 },
    29: { min: 94.2, avg: 104.8, max: 117.5 },
    30: { min: 95.3, avg: 105.9, max: 118.6 },
    31: { min: 96.4, avg: 106.9, max: 119.7 },
    32: { min: 97.5, avg: 107.9, max: 120.7 },
    33: { min: 98.6, avg: 108.9, max: 121.7 },
    34: { min: 99.6, avg: 109.8, max: 122.7 },
    35: { min: 100.6, avg: 110.7, max: 123.6 },
    36: { min: 101.5, avg: 111.6, max: 124.5 },
    37: { min: 102.4, avg: 112.5, max: 125.4 },
    38: { min: 103.3, avg: 113.3, max: 126.3 },
    39: { min: 104.2, avg: 114.1, max: 127.1 },
    40: { min: 105.0, avg: 114.9, max: 127.9 },
    41: { min: 105.8, avg: 115.7, max: 128.7 },
    42: { min: 106.6, avg: 116.5, max: 129.4 },
    43: { min: 107.3, avg: 117.2, max: 130.2 },
    44: { min: 108.1, avg: 117.9, max: 130.9 },
    45: { min: 108.8, avg: 118.6, max: 131.6 },
    46: { min: 109.5, avg: 119.3, max: 132.3 },
    47: { min: 110.2, avg: 120.0, max: 133.0 },
    48: { min: 110.8, avg: 120.7, max: 133.7 },
    49: { min: 111.5, avg: 121.4, max: 134.4 },
    50: { min: 112.1, avg: 122.0, max: 135.0 },
    51: { min: 112.7, avg: 122.7, max: 135.7 },
    52: { min: 113.3, avg: 123.3, max: 136.3 },
    53: { min: 113.9, avg: 123.9, max: 136.9 },
    54: { min: 114.5, avg: 124.5, max: 137.5 },
    55: { min: 115.1, avg: 125.1, max: 138.1 },
    56: { min: 115.6, avg: 125.7, max: 138.7 },
    57: { min: 116.2, avg: 126.3, max: 139.3 },
    58: { min: 116.7, avg: 126.9, max: 139.9 },
    59: { min: 117.3, avg: 127.5, max: 140.5 },
    60: { min: 117.8, avg: 128.0, max: 141.1 },
    61: { min: 118.3, avg: 128.6, max: 141.7 },
    62: { min: 118.8, avg: 129.1, max: 142.2 },
    63: { min: 119.3, avg: 129.7, max: 142.8 },
    64: { min: 119.8, avg: 130.2, max: 143.3 },
    65: { min: 120.3, avg: 130.7, max: 143.8 },
    66: { min: 120.8, avg: 131.3, max: 144.4 },
    67: { min: 121.3, avg: 131.8, max: 144.9 },
    68: { min: 121.8, avg: 132.3, max: 145.4 },
    69: { min: 122.2, avg: 132.8, max: 145.9 },
    70: { min: 122.7, avg: 133.3, max: 146.4 },
    71: { min: 123.2, avg: 133.8, max: 146.9 },
    72: { min: 123.6, avg: 134.3, max: 147.4 },
    73: { min: 124.1, avg: 134.8, max: 147.9 },
    74: { min: 124.5, avg: 135.2, max: 148.4 },
    75: { min: 125.0, avg: 135.7, max: 148.9 },
    76: { min: 125.4, avg: 136.2, max: 149.4 },
    77: { min: 125.9, avg: 136.6, max: 149.8 },
    78: { min: 126.3, avg: 137.1, max: 150.3 },
    79: { min: 126.7, avg: 137.5, max: 150.8 },
    80: { min: 127.2, avg: 138.0, max: 151.2 },
    81: { min: 127.6, avg: 138.4, max: 151.7 },
    82: { min: 128.0, avg: 138.9, max: 152.1 },
    83: { min: 128.4, avg: 139.3, max: 152.6 },
    84: { min: 128.8, avg: 139.7, max: 153.0 },
    85: { min: 129.2, avg: 140.1, max: 153.4 },
    86: { min: 129.6, avg: 140.5, max: 153.9 },
    87: { min: 130.0, avg: 140.9, max: 154.3 },
    88: { min: 130.4, avg: 141.3, max: 154.7 },
    89: { min: 130.8, avg: 141.7, max: 155.1 },
    90: { min: 131.2, avg: 142.1, max: 155.5 },
    91: { min: 131.6, avg: 142.5, max: 155.9 },
    92: { min: 132.0, avg: 142.9, max: 156.3 },
    93: { min: 132.3, avg: 143.3, max: 156.7 },
    94: { min: 132.7, avg: 143.6, max: 157.1 },
    95: { min: 133.1, avg: 144.0, max: 157.5 },
    96: { min: 133.4, avg: 144.4, max: 157.9 },
    97: { min: 133.8, avg: 144.7, max: 158.3 },
    98: { min: 134.1, avg: 145.1, max: 158.7 },
    99: { min: 134.5, avg: 145.4, max: 159.1 },
    100: { min: 134.8, avg: 145.8, max: 159.5 },
    101: { min: 135.2, avg: 146.1, max: 159.8 },
    102: { min: 135.5, avg: 146.5, max: 160.2 },
    103: { min: 135.8, avg: 146.8, max: 160.6 },
    104: { min: 136.2, avg: 147.1, max: 161.0 },
    105: { min: 136.5, avg: 147.5, max: 161.4 },
    106: { min: 136.8, avg: 147.8, max: 161.8 },
    107: { min: 137.1, avg: 148.1, max: 162.2 },
    108: { min: 137.4, avg: 148.5, max: 162.6 },
    109: { min: 137.8, avg: 148.8, max: 163.0 },
    110: { min: 138.1, avg: 149.1, max: 163.4 },
    111: { min: 138.4, avg: 149.4, max: 163.8 },
    112: { min: 138.7, avg: 149.7, max: 164.2 },
    113: { min: 139.0, avg: 150.1, max: 164.6 },
    114: { min: 139.3, avg: 150.4, max: 165.0 },
    115: { min: 139.6, avg: 150.7, max: 165.4 },
    116: { min: 139.9, avg: 151.0, max: 165.8 },
    117: { min: 140.2, avg: 151.3, max: 166.2 },
    118: { min: 140.5, avg: 151.6, max: 166.6 },
    119: { min: 140.8, avg: 151.9, max: 167.0 },
    120: { min: 141.1, avg: 152.2, max: 167.4 },
    121: { min: 141.4, avg: 152.5, max: 167.8 },
    122: { min: 141.7, avg: 152.8, max: 168.2 },
    123: { min: 142.0, avg: 153.1, max: 168.6 },
    124: { min: 142.2, avg: 153.4, max: 169.0 },
    125: { min: 142.5, avg: 153.7, max: 169.4 },
    126: { min: 142.8, avg: 154.0, max: 169.8 },
    127: { min: 143.0, avg: 154.3, max: 170.2 },
    128: { min: 143.3, avg: 154.6, max: 170.6 },
    129: { min: 143.6, avg: 154.9, max: 171.0 },
    130: { min: 143.8, avg: 155.2, max: 171.4 },
    131: { min: 144.1, avg: 155.5, max: 171.8 },
    132: { min: 144.3, avg: 155.8, max: 172.2 },
    133: { min: 144.6, avg: 156.1, max: 172.6 },
    134: { min: 144.8, avg: 156.3, max: 173.0 },
    135: { min: 145.1, avg: 156.6, max: 173.4 },
    136: { min: 145.3, avg: 156.9, max: 173.8 },
    137: { min: 145.6, avg: 157.2, max: 174.2 },
    138: { min: 145.8, avg: 157.5, max: 174.6 },
    139: { min: 146.1, avg: 157.8, max: 175.0 },
    140: { min: 146.3, avg: 158.1, max: 175.4 },
    141: { min: 146.5, avg: 158.3, max: 175.8 },
    142: { min: 146.8, avg: 158.6, max: 176.2 },
    143: { min: 147.0, avg: 158.9, max: 176.6 },
    144: { min: 147.2, avg: 159.2, max: 177.0 },
    145: { min: 147.4, avg: 159.5, max: 177.4 },
    146: { min: 147.7, avg: 159.7, max: 177.8 },
    147: { min: 147.9, avg: 160.0, max: 178.2 },
    148: { min: 148.1, avg: 160.3, max: 178.6 },
    149: { min: 148.3, avg: 160.5, max: 179.0 },
    150: { min: 148.5, avg: 160.8, max: 179.4 }
};

// 中国标准身高参考数据（男童，单位：cm）
const chineseStandardHeightMale = {
    0: { min: 46.9, avg: 50.8, max: 54.7 },
    1: { min: 50.4, avg: 54.5, max: 58.6 },
    2: { min: 53.3, avg: 58.1, max: 62.9 },
    3: { min: 55.6, avg: 61.3, max: 67.0 },
    4: { min: 57.8, avg: 64.3, max: 70.8 },
    5: { min: 59.9, avg: 67.0, max: 74.1 },
    6: { min: 61.8, avg: 69.6, max: 77.4 },
    7: { min: 63.7, avg: 72.0, max: 80.3 },
    8: { min: 65.5, avg: 74.3, max: 83.1 },
    9: { min: 67.3, avg: 76.5, max: 85.7 },
    10: { min: 69.0, avg: 78.6, max: 88.2 },
    11: { min: 70.7, avg: 80.7, max: 90.7 },
    12: { min: 72.4, avg: 82.7, max: 93.0 },
    13: { min: 74.0, avg: 84.6, max: 95.2 },
    14: { min: 75.6, avg: 86.5, max: 97.4 },
    15: { min: 77.2, avg: 88.3, max: 99.4 },
    16: { min: 78.7, avg: 90.1, max: 101.5 },
    17: { min: 80.2, avg: 91.8, max: 103.4 },
    18: { min: 81.7, avg: 93.5, max: 105.3 },
    19: { min: 83.1, avg: 95.1, max: 107.1 },
    20: { min: 84.5, avg: 96.7, max: 108.9 },
    21: { min: 85.9, avg: 98.2, max: 110.5 },
    22: { min: 87.2, avg: 99.7, max: 112.2 },
    23: { min: 88.5, avg: 101.2, max: 113.9 },
    24: { min: 89.8, avg: 102.6, max: 115.4 },
    25: { min: 91.1, avg: 104.0, max: 117.0 },
    26: { min: 92.3, avg: 105.4, max: 118.5 },
    27: { min: 93.5, avg: 106.7, max: 120.0 },
    28: { min: 94.7, avg: 108.0, max: 121.3 },
    29: { min: 95.8, avg: 109.3, max: 122.8 },
    30: { min: 97.0, avg: 110.5, max: 124.1 },
    31: { min: 98.1, avg: 111.7, max: 125.4 },
    32: { min: 99.2, avg: 112.9, max: 126.6 },
    33: { min: 100.2, avg: 114.0, max: 127.8 },
    34: { min: 101.3, avg: 115.1, max: 129.0 },
    35: { min: 102.3, avg: 116.2, max: 130.1 },
    36: { min: 103.2, avg: 117.2, max: 131.2 },
    37: { min: 104.2, avg: 118.2, max: 132.3 },
    38: { min: 105.1, avg: 119.1, max: 133.3 },
    39: { min: 106.0, avg: 120.1, max: 134.3 },
    40: { min: 106.9, avg: 121.0, max: 135.2 },
    41: { min: 107.8, avg: 121.9, max: 136.2 },
    42: { min: 108.6, avg: 122.7, max: 137.1 },
    43: { min: 109.5, avg: 123.6, max: 138.0 },
    44: { min: 110.3, avg: 124.4, max: 138.8 },
    45: { min: 111.1, avg: 125.2, max: 139.7 },
    46: { min: 111.9, avg: 126.0, max: 140.5 },
    47: { min: 112.7, avg: 126.7, max: 141.3 },
    48: { min: 113.4, avg: 127.5, max: 142.1 },
    49: { min: 114.2, avg: 128.2, max: 142.9 },
    50: { min: 114.9, avg: 128.9, max: 143.7 },
    51: { min: 115.6, avg: 129.6, max: 144.5 },
    52: { min: 116.3, avg: 130.3, max: 145.3 },
    53: { min: 117.0, avg: 131.0, max: 146.1 },
    54: { min: 117.7, avg: 131.7, max: 146.9 },
    55: { min: 118.4, avg: 132.3, max: 147.7 },
    56: { min: 119.0, avg: 133.0, max: 148.4 },
    57: { min: 119.7, avg: 133.6, max: 149.2 },
    58: { min: 120.3, avg: 134.2, max: 149.9 },
    59: { min: 121.0, avg: 134.8, max: 150.7 },
    60: { min: 121.6, avg: 135.4, max: 151.4 },
    61: { min: 122.2, avg: 136.0, max: 152.1 },
    62: { min: 122.8, avg: 136.6, max: 152.8 },
    63: { min: 123.4, avg: 137.1, max: 153.5 },
    64: { min: 124.0, avg: 137.7, max: 154.2 },
    65: { min: 124.6, avg: 138.2, max: 154.9 },
    66: { min: 125.1, avg: 138.8, max: 155.6 },
    67: { min: 125.7, avg: 139.3, max: 156.2 },
    68: { min: 126.2, avg: 139.8, max: 156.9 },
    69: { min: 126.8, avg: 140.3, max: 157.5 },
    70: { min: 127.3, avg: 140.8, max: 158.2 },
    71: { min: 127.9, avg: 141.3, max: 158.8 },
    72: { min: 128.4, avg: 141.8, max: 159.4 },
    73: { min: 128.9, avg: 142.3, max: 160.0 },
    74: { min: 129.4, avg: 142.8, max: 160.6 },
    75: { min: 130.0, avg: 143.3, max: 161.2 },
    76: { min: 130.5, avg: 143.8, max: 161.8 },
    77: { min: 131.0, avg: 144.2, max: 162.4 },
    78: { min: 131.5, avg: 144.7, max: 163.0 },
    79: { min: 132.0, avg: 145.1, max: 163.6 },
    80: { min: 132.4, avg: 145.6, max: 164.2 },
    81: { min: 132.9, avg: 146.0, max: 164.8 },
    82: { min: 133.4, avg: 146.5, max: 165.4 },
    83: { min: 133.8, avg: 146.9, max: 165.9 },
    84: { min: 134.3, avg: 147.3, max: 166.5 },
    85: { min: 134.7, avg: 147.8, max: 167.1 },
    86: { min: 135.1, avg: 148.2, max: 167.6 },
    87: { min: 135.6, avg: 148.6, max: 168.2 },
    88: { min: 136.0, avg: 149.0, max: 168.7 },
    89: { min: 136.4, avg: 149.4, max: 169.3 },
    90: { min: 136.8, avg: 149.9, max: 169.9 },
    91: { min: 137.2, avg: 150.3, max: 170.4 },
    92: { min: 137.6, avg: 150.7, max: 171.0 },
    93: { min: 138.0, avg: 151.1, max: 171.5 },
    94: { min: 138.4, avg: 151.5, max: 172.1 },
    95: { min: 138.8, avg: 151.9, max: 172.6 },
    96: { min: 139.2, avg: 152.3, max: 173.2 },
    97: { min: 139.6, avg: 152.7, max: 173.7 },
    98: { min: 140.0, avg: 153.1, max: 174.3 },
    99: { min: 140.3, avg: 153.5, max: 174.8 },
    100: { min: 140.7, avg: 153.9, max: 175.4 },
    101: { min: 141.1, avg: 154.3, max: 175.9 },
    102: { min: 141.4, avg: 154.7, max: 176.5 },
    103: { min: 141.8, avg: 155.0, max: 177.0 },
    104: { min: 142.2, avg: 155.4, max: 177.6 },
    105: { min: 142.5, avg: 155.8, max: 178.1 },
    106: { min: 142.9, avg: 156.2, max: 178.7 },
    107: { min: 143.2, avg: 156.5, max: 179.2 },
    108: { min: 143.6, avg: 156.9, max: 179.8 },
    109: { min: 143.9, avg: 157.3, max: 180.3 },
    110: { min: 144.2, avg: 157.6, max: 180.9 },
    111: { min: 144.6, avg: 158.0, max: 181.4 },
    112: { min: 144.9, avg: 158.3, max: 182.0 },
    113: { min: 145.2, avg: 158.7, max: 182.5 },
    114: { min: 145.6, avg: 159.0, max: 183.1 },
    115: { min: 145.9, avg: 159.4, max: 183.6 },
    116: { min: 146.2, avg: 159.7, max: 184.2 },
    117: { min: 146.5, avg: 160.1, max: 184.7 },
    118: { min: 146.8, avg: 160.4, max: 185.3 },
    119: { min: 147.1, avg: 160.7, max: 185.8 },
    120: { min: 147.4, avg: 161.0, max: 186.4 },
    121: { min: 147.7, avg: 161.4, max: 186.9 },
    122: { min: 148.0, avg: 161.7, max: 187.5 },
    123: { min: 148.3, avg: 162.0, max: 188.0 },
    124: { min: 148.6, avg: 162.3, max: 188.6 },
    125: { min: 148.9, avg: 162.6, max: 189.1 },
    126: { min: 149.1, avg: 163.0, max: 189.7 },
    127: { min: 149.4, avg: 163.3, max: 190.2 },
    128: { min: 149.7, avg: 163.6, max: 190.8 },
    129: { min: 150.0, avg: 163.9, max: 191.3 },
    130: { min: 150.2, avg: 164.2, max: 191.9 },
    131: { min: 150.5, avg: 164.5, max: 192.4 },
    132: { min: 150.7, avg: 164.8, max: 193.0 },
    133: { min: 151.0, avg: 165.1, max: 193.5 },
    134: { min: 151.2, avg: 165.4, max: 194.1 },
    135: { min: 151.5, avg: 165.7, max: 194.6 },
    136: { min: 151.7, avg: 166.0, max: 195.2 },
    137: { min: 152.0, avg: 166.3, max: 195.7 },
    138: { min: 152.2, avg: 166.6, max: 196.3 },
    139: { min: 152.4, avg: 166.9, max: 196.8 },
    140: { min: 152.7, avg: 167.2, max: 197.4 },
    141: { min: 152.9, avg: 167.5, max: 197.9 },
    142: { min: 153.1, avg: 167.7, max: 198.5 },
    143: { min: 153.3, avg: 168.0, max: 199.0 },
    144: { min: 153.6, avg: 168.3, max: 199.6 },
    145: { min: 153.8, avg: 168.6, max: 200.1 },
    146: { min: 154.0, avg: 168.8, max: 200.7 },
    147: { min: 154.2, avg: 169.1, max: 201.2 },
    148: { min: 154.4, avg: 169.4, max: 201.8 },
    149: { min: 154.6, avg: 169.6, max: 202.3 },
    150: { min: 154.8, avg: 169.9, max: 202.9 }
};

// 初始化应用
async function initApp() {
    // 先从云端加载数据
    await loadCloudData();
    
    // 加载本地数据（作为备份）
    loadData();
    
    // 设置当前日期
    document.getElementById('record-date').value = new Date().toISOString().split('T')[0];
    
    // 绑定事件
    bindEvents();
    
    // 更新页面
    updateHomePage();
    updateHistoryRecords();
    updateStats();
    drawChart();
    loadAppName();
    
    // 更新参考提示
    updateHeightReference();
    updateWeightReference();
    
    // 更新孩子列表
    updateChildList();
}

// 加载应用名称
function loadAppName() {
    const savedAppName = localStorage.getItem('appName');
    if (savedAppName) {
        document.getElementById('app-title').textContent = savedAppName;
        document.getElementById('app-name-input').value = savedAppName;
        document.title = savedAppName;
    }
}

// 更新应用名称
function updateAppName() {
    const appName = document.getElementById('app-name-input').value;
    if (appName) {
        document.getElementById('app-title').textContent = appName;
        document.title = appName;
        localStorage.setItem('appName', appName);
        alert('应用名称更新成功！');
    }
}

// 加载数据
function loadData() {
    const savedChildren = localStorage.getItem('children');
    const savedGrowthData = localStorage.getItem('growthData');
    
    if (savedChildren) {
        children = JSON.parse(savedChildren);
        // 为每个孩子添加默认的avatar属性
        children = children.map(child => ({
            ...child,
            avatar: child.avatar || 'default'
        }));
    } else {
        // 初始化默认孩子数据
        children = [
            { id: 0, name: '大宝', birthday: '', gender: 'female', avatar: 'default' },
            { id: 1, name: '小宝', birthday: '', gender: 'female', avatar: 'default' }
        ];
    }
    
    if (savedGrowthData) {
        growthData = JSON.parse(savedGrowthData);
    }
    
    // 更新孩子选择器
    updateChildSelectors();
}

// 保存数据
async function saveData() {
    // 保存到本地存储（作为备份）
    localStorage.setItem('children', JSON.stringify(children));
    localStorage.setItem('growthData', JSON.stringify(growthData));
    
    // 保存到云端
    const currentUser = authManager.getCurrentUser();
    if (currentUser) {
        const data = {
            children: children,
            growthData: growthData,
            updatedAt: new Date().toISOString()
        };
        
        try {
            await cloudDataManager.saveData(data);
        } catch (error) {
            console.log('云端保存失败，数据已保存到本地');
        }
    }
}

// 从云端加载数据
async function loadCloudData() {
    const currentUser = authManager.getCurrentUser();
    if (!currentUser) return;
    
    try {
        const result = await cloudDataManager.loadData();
        if (result.success && result.data) {
            if (result.data.children) {
                children = result.data.children;
            }
            if (result.data.growthData) {
                growthData = result.data.growthData;
            }
            
            // 保存到本地存储
            localStorage.setItem('children', JSON.stringify(children));
            localStorage.setItem('growthData', JSON.stringify(growthData));
        }
    } catch (error) {
        console.log('从云端加载数据失败，使用本地数据');
    }
}

// 更新孩子选择器
function updateChildSelectors() {
    const selectors = [
        'child-select',
        'record-child-select',
        'analysis-child-select'
    ];
    
    selectors.forEach(selectorId => {
        const selector = document.getElementById(selectorId);
        if (selector) {
            selector.innerHTML = '';
            children.forEach((child, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = child.name;
                selector.appendChild(option);
            });
        }
    });
    
    // 更新所有页面的孩子标签页
    updateChildTabs();
}

// 更新所有页面的孩子标签页
function updateChildTabs() {
    const tabContainers = [
        { selector: '#home .child-tabs', activeIndex: 0 },
        { selector: '#record .child-tabs', activeIndex: 0 },
        { selector: '#analysis .child-tabs', activeIndex: 0 }
    ];
    
    tabContainers.forEach(container => {
        const tabsContainer = document.querySelector(container.selector);
        if (tabsContainer) {
            tabsContainer.innerHTML = '';
            children.forEach((child, index) => {
                const tab = document.createElement('div');
                tab.className = `child-tab ${index === container.activeIndex ? 'active' : ''}`;
                tab.setAttribute('data-index', index);
                tab.innerHTML = `
                    <span class="child-avatar">
                        <i class="fas ${child.avatar === 'default' ? 'fa-baby' : 
                                 child.avatar === 'avatar1' ? 'fa-child' : 
                                 child.avatar === 'avatar2' ? 'fa-baby-carriage' : 
                                 child.avatar === 'avatar3' ? 'fa-star' : 
                                 child.avatar === 'avatar4' ? 'fa-heart' : 'fa-baby'}"></i>
                    </span>
                    <span>${child.name}</span>
                `;
                
                // 根据容器选择器添加不同的点击事件
                if (container.selector === '#home .child-tabs') {
                    tab.onclick = () => selectChild(index);
                } else if (container.selector === '#record .child-tabs') {
                    tab.onclick = () => selectRecordChild(index);
                } else if (container.selector === '#analysis .child-tabs') {
                    tab.onclick = () => selectAnalysisChild(index);
                }
                
                tabsContainer.appendChild(tab);
            });
        }
    });
}

// 选择孩子
function selectChild(index) {
    // 更新首页的孩子标签页状态
    const homeChildTabs = document.querySelectorAll('#home .child-tab');
    homeChildTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    const selectedTab = document.querySelector(`#home .child-tab[data-index="${index}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // 更新隐藏的选择器值
    const childSelect = document.getElementById('child-select');
    if (childSelect) {
        childSelect.value = index;
    }
    
    // 更新页面
    updateHomePage();
}

// 选择记录页面的孩子
function selectRecordChild(index) {
    // 更新记录页面的孩子标签页状态
    const recordChildTabs = document.querySelectorAll('#record .child-tab');
    recordChildTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    const selectedTab = document.querySelector(`#record .child-tab[data-index="${index}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // 更新隐藏的选择器值
    const recordChildSelect = document.getElementById('record-child-select');
    if (recordChildSelect) {
        recordChildSelect.value = index;
    }
    
    // 更新历史记录
    updateHistoryRecords();
    
    // 更新参考提示
    updateHeightReference();
    updateWeightReference();
}

// 选择分析页面的孩子
function selectAnalysisChild(index) {
    // 更新分析页面的孩子标签页状态
    const analysisChildTabs = document.querySelectorAll('#analysis .child-tab');
    analysisChildTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    const selectedTab = document.querySelector(`#analysis .child-tab[data-index="${index}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // 更新隐藏的选择器值
    const analysisChildSelect = document.getElementById('analysis-child-select');
    if (analysisChildSelect) {
        analysisChildSelect.value = index;
    }
    
    // 更新页面
    drawChart();
    updateStats();
}



// 获取标准身高参考数据
function getStandardHeight(ageMonths, gender) {
    if (ageMonths < 0 || ageMonths > 150) return null;
    
    const standardData = gender === 'female' ? chineseStandardHeightFemale : chineseStandardHeightMale;
    return standardData[ageMonths] || null;
}

// 更新身高参考提示
function updateHeightReference() {
    const recordChildSelect = document.getElementById('record-child-select');
    if (!recordChildSelect) return;
    
    const childIndex = parseInt(recordChildSelect.value);
    const child = children[childIndex];
    const ageMonths = calculateAgeInMonths(child.birthday);
    const standardHeight = getStandardHeight(ageMonths, child.gender);
    
    const heightReferenceElement = document.getElementById('height-reference');
    if (heightReferenceElement) {
        if (standardHeight) {
            heightReferenceElement.innerHTML = `
                <div class="reference-info">
                    <h4><i class="fas fa-info-circle"></i> 身高参考（${formatAge(ageMonths)}）</h4>
                    <p>标准范围：${standardHeight.min} - ${standardHeight.max} cm</p>
                    <p>平均值：${standardHeight.avg} cm</p>
                </div>
            `;
        } else {
            heightReferenceElement.innerHTML = `
                <div class="reference-info">
                    <h4><i class="fas fa-info-circle"></i> 身高参考</h4>
                    <p>请先设置孩子的出生日期</p>
                </div>
            `;
        }
    }
}

// 更新体重参考提示
function updateWeightReference() {
    const recordChildSelect = document.getElementById('record-child-select');
    if (!recordChildSelect) return;
    
    const childIndex = parseInt(recordChildSelect.value);
    const child = children[childIndex];
    const ageMonths = calculateAgeInMonths(child.birthday);
    
    let weightRange = '';
    if (ageMonths < 1) {
        weightRange = '5-9 斤';
    } else if (ageMonths < 3) {
        weightRange = '7-12 斤';
    } else if (ageMonths < 6) {
        weightRange = '9-15 斤';
    } else if (ageMonths < 12) {
        weightRange = '12-20 斤';
    } else if (ageMonths < 24) {
        weightRange = '16-28 斤';
    } else if (ageMonths < 36) {
        weightRange = '20-32 斤';
    } else if (ageMonths < 48) {
        weightRange = '22-36 斤';
    } else if (ageMonths < 60) {
        weightRange = '24-40 斤';
    } else if (ageMonths < 72) {
        weightRange = '28-44 斤';
    } else if (ageMonths < 84) {
        weightRange = '30-48 斤';
    } else if (ageMonths < 96) {
        weightRange = '34-52 斤';
    } else if (ageMonths < 108) {
        weightRange = '38-58 斤';
    } else if (ageMonths < 120) {
        weightRange = '42-64 斤';
    } else {
        weightRange = '根据年龄参考标准值';
    }
    
    const weightReferenceElement = document.getElementById('weight-reference');
    if (weightReferenceElement) {
        if (child.birthday) {
            weightReferenceElement.innerHTML = `
                <div class="reference-info">
                    <h4><i class="fas fa-info-circle"></i> 体重参考（${formatAge(ageMonths)}）</h4>
                    <p>参考范围：${weightRange}</p>
                    <p>请输入合理的体重值（单位：斤）</p>
                </div>
            `;
        } else {
            weightReferenceElement.innerHTML = `
                <div class="reference-info">
                    <h4><i class="fas fa-info-circle"></i> 体重参考</h4>
                    <p>请先设置孩子的出生日期</p>
                </div>
            `;
        }
    }
}

// 绑定事件
function bindEvents() {
    // 导航链接点击事件
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            navigateTo(targetId);
        });
    });
    
    // 孩子选择器变化事件
    const childSelect = document.getElementById('child-select');
    if (childSelect) {
        childSelect.addEventListener('change', updateHomePage);
    }
    
    const recordChildSelect = document.getElementById('record-child-select');
    if (recordChildSelect) {
        recordChildSelect.addEventListener('change', updateHistoryRecords);
    }
    
    const analysisChildSelect = document.getElementById('analysis-child-select');
    if (analysisChildSelect) {
        analysisChildSelect.addEventListener('change', drawChart);
    }
    
    const analysisType = document.getElementById('analysis-type');
    if (analysisType) {
        analysisType.addEventListener('change', drawChart);
    }
    
    // 按钮点击事件
    const submitButton = document.querySelector('button[onclick="submitRecord()"]');
    if (submitButton) {
        submitButton.addEventListener('click', submitRecord);
    }
    
    const exportButton = document.querySelector('.list-item[onclick="exportData()"]');
    if (exportButton) {
        exportButton.addEventListener('click', exportData);
    }
    
    const clearButton = document.querySelector('.list-item[onclick="clearData()"]');
    if (clearButton) {
        clearButton.addEventListener('click', clearData);
    }
    
    const editButtons = document.querySelectorAll('button[onclick^="editChild("]');
    editButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            editChild(index);
        });
    });
    
    const closeDialogButton = document.querySelector('button[onclick="closeEditDialog()"]');
    if (closeDialogButton) {
        closeDialogButton.addEventListener('click', closeEditDialog);
    }
    
    const saveChildButton = document.querySelector('button[onclick="saveChild()"]');
    if (saveChildButton) {
        saveChildButton.addEventListener('click', saveChild);
    }
    
    const navigateButtons = document.querySelectorAll('button[onclick^="navigateTo("]');
    navigateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const pageId = this.getAttribute('onclick').match(/navigateTo\('(.*)'\)/)[1];
            navigateTo(pageId);
        });
    });
    
    const updateAppNameButton = document.querySelector('button[onclick="updateAppName()"]');
    if (updateAppNameButton) {
        updateAppNameButton.addEventListener('click', updateAppName);
    }
    
    const closeConfirmButton = document.querySelector('button[onclick="closeConfirmDialog()"]');
    if (closeConfirmButton) {
        closeConfirmButton.addEventListener('click', closeConfirmDialog);
    }
    
    const confirmActionButton = document.querySelector('button[onclick="confirmAction()"]');
    if (confirmActionButton) {
        confirmActionButton.addEventListener('click', confirmAction);
    }
}

// 导航到指定页面
function navigateTo(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // 显示目标页面
    const targetSection = document.getElementById(pageId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // 更新导航链接状态
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${pageId}`) {
            link.classList.add('active');
        }
    });
    
    // 特殊处理
    if (pageId === 'home') {
        updateHomePage();
    } else if (pageId === 'record') {
        updateHistoryRecords();
    } else if (pageId === 'analysis') {
        drawChart();
        updateStats();
    }
}

// 更新首页
function updateHomePage() {
    const childSelect = document.getElementById('child-select');
    if (!childSelect) return;
    
    const childIndex = parseInt(childSelect.value);
    const child = children[childIndex];
    
    // 更新最近记录
    const latestRecord = getLatestRecord(child.id);
    const latestRecordElement = document.getElementById('latest-record');
    
    if (latestRecord && latestRecordElement) {
        latestRecordElement.innerHTML = `
            <div class="record-content">
                <h3>最近记录</h3>
                <div class="record-meta">
                    <span><i class="fas fa-calendar-alt"></i> ${latestRecord.date}</span>
                </div>
                <div class="record-meta">
                    <span><i class="fas fa-ruler"></i> ${latestRecord.height} cm</span>
                    <span><i class="fas fa-weight"></i> ${latestRecord.weight} 斤</span>
                </div>
            </div>
        `;
    } else if (latestRecordElement) {
        latestRecordElement.innerHTML = `
            <div class="record-content">
                <h3>最近记录</h3>
                <p>暂无记录</p>
            </div>
        `;
    }
}

// 获取最新记录
function getLatestRecord(childId) {
    const childRecords = growthData.filter(record => record.childId === childId);
    if (childRecords.length === 0) return null;
    
    // 按日期排序，取最新的
    childRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    return childRecords[0];
}

// 自动转换体重单位（斤转公斤）
function autoConvertWeight(weightValue) {
    // 体重单位已统一为斤，不需要自动转换
    return {
        original: weightValue,
        converted: weightValue,
        message: null
    };
}

// 提交记录
function submitRecord() {
    // 清除错误信息
    const heightError = document.getElementById('height-error');
    const weightError = document.getElementById('weight-error');
    const successMessage = document.getElementById('success-message');
    
    if (heightError) heightError.textContent = '';
    if (weightError) weightError.textContent = '';
    if (successMessage) successMessage.textContent = '';
    
    // 获取表单数据
    const recordChildSelect = document.getElementById('record-child-select');
    const recordDate = document.getElementById('record-date');
    const recordHeight = document.getElementById('record-height');
    const recordWeight = document.getElementById('record-weight');
    
    if (!recordChildSelect || !recordDate || !recordHeight || !recordWeight) {
        alert('表单元素未找到');
        return;
    }
    
    const childIndex = parseInt(recordChildSelect.value);
    const child = children[childIndex];
    const date = recordDate.value;
    const heightStr = recordHeight.value.trim();
    const weightStr = recordWeight.value.trim();
    
    // 检查是否为空
    if (!heightStr || !weightStr) {
        if (!heightStr && heightError) heightError.textContent = '请输入身高';
        if (!weightStr && weightError) weightError.textContent = '请输入体重';
        return;
    }
    
    const height = parseFloat(heightStr);
    let weight = parseFloat(weightStr);
    
    // 验证数据
    let isValid = true;
    
    if (isNaN(height) || height <= 0 || height > 250) {
        if (heightError) heightError.textContent = '身高输入无效，请输入合理的身高值（1-250cm）';
        isValid = false;
    }
    
    if (isNaN(weight) || weight <= 0 || weight > 400) {
        if (weightError) weightError.textContent = '体重输入无效，请输入合理的体重值（1-400斤）';
        isValid = false;
    }
    
    if (!isValid) return;
    
    // 检查当天是否已有记录
    const existingRecord = growthData.find(record => 
        record.childId === child.id && record.date === date
    );
    
    if (existingRecord) {
        if (!confirm('当天已有记录，是否要覆盖？')) {
            return;
        }
        // 删除旧记录
        growthData = growthData.filter(record => record.id !== existingRecord.id);
    }
    
    // 自动转换体重单位
    const weightConversion = autoConvertWeight(weight);
    
    // 如果需要转换，让用户确认
    if (weightConversion.message) {
        if (!confirm(weightConversion.message + '\n\n是否确认使用转换后的值？')) {
            return;
        } else {
            weight = weightConversion.converted;
            // 更新输入框显示转换后的值
            recordWeight.value = weight.toFixed(1);
        }
    }
    
    // 检查异常数据
    const latestRecord = getLatestRecord(child.id);
    if (latestRecord) {
        const heightDiff = Math.abs(height - parseFloat(latestRecord.height));
        if (heightDiff > 10) {
            if (!confirm('身高变化异常，确定要保存吗？')) {
                return;
            }
        }
        
        const weightDiff = Math.abs(weight - parseFloat(latestRecord.weight));
        if (weightDiff > 10) {
            if (!confirm('体重变化异常，确定要保存吗？')) {
                return;
            }
        }
    }
    
    // 创建新记录
    const newRecord = {
        id: Date.now(),
        childId: child.id,
        childName: child.name,
        date: date,
        height: height,
        weight: weight
    };
    
    // 添加到数据中
    growthData.push(newRecord);
    saveData();
    
    // 显示成功消息
    if (successMessage) successMessage.textContent = '记录提交成功！';
    
    // 清空表单
    recordHeight.value = '';
    recordWeight.value = '';
    
    // 更新历史记录
    updateHistoryRecords();
    
    // 3秒后清除成功消息
    setTimeout(() => {
        if (successMessage) successMessage.textContent = '';
    }, 3000);
}

// 更新历史记录
function updateHistoryRecords() {
    const recordChildSelect = document.getElementById('record-child-select');
    const historyContainer = document.getElementById('history-records');
    
    if (!recordChildSelect || !historyContainer) return;
    
    const childIndex = parseInt(recordChildSelect.value);
    const child = children[childIndex];
    
    const childRecords = growthData.filter(record => record.childId === child.id);
    
    if (childRecords.length > 0) {
        // 按日期倒序排序
        childRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        let html = '';
        childRecords.forEach(record => {
            html += `
                <div class="list-item">
                    <div class="list-item-content">
                        <h3>${record.date}</h3>
                        <p>身高: ${record.height} cm | 体重: ${record.weight} 斤</p>
                    </div>
                    <div class="list-item-actions">
                        <button class="button small danger" onclick="deleteRecord(${record.id})"><i class="fas fa-trash"></i> 删除</button>
                    </div>
                </div>
            `;
        });
        
        historyContainer.innerHTML = html;
    } else {
        historyContainer.innerHTML = '<p>暂无历史记录</p>';
    }
}

// 删除记录
function deleteRecord(recordId) {
    showConfirmDialog('确定要删除这条记录吗？', () => {
        growthData = growthData.filter(record => record.id !== recordId);
        saveData();
        updateHistoryRecords();
        updateHomePage();
        updateStats();
        drawChart();
        alert('记录删除成功！');
    });
}

// 显示确认对话框
function showConfirmDialog(message, callback) {
    const confirmDialog = document.getElementById('confirm-dialog');
    const confirmMessage = document.getElementById('confirm-message');
    
    if (confirmDialog && confirmMessage) {
        confirmMessage.textContent = message;
        confirmCallback = callback;
        confirmDialog.classList.add('show');
    }
}

// 关闭确认对话框
function closeConfirmDialog() {
    const confirmDialog = document.getElementById('confirm-dialog');
    if (confirmDialog) {
        confirmDialog.classList.remove('show');
        confirmCallback = null;
    }
}

// 确认操作
function confirmAction() {
    if (confirmCallback) {
        confirmCallback();
        closeConfirmDialog();
    }
}

// 绘制图表
function drawChart() {
    const analysisChildSelect = document.getElementById('analysis-child-select');
    const analysisType = document.getElementById('analysis-type');
    const chartCanvas = document.getElementById('growth-chart');
    
    if (!analysisChildSelect || !analysisType || !chartCanvas) return;
    
    const childIndex = parseInt(analysisChildSelect.value);
    const child = children[childIndex];
    const chartType = analysisType.value;
    
    const childRecords = growthData.filter(record => record.childId === child.id);
    const ctx = chartCanvas.getContext('2d');
    
    // 销毁旧图表
    if (currentChart) {
        currentChart.destroy();
    }
    
    if (childRecords.length === 0) {
        // 清空图表
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        return;
    }
    
    // 按日期排序
    childRecords.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // 准备数据
    const labels = childRecords.map(record => record.date);
    const heights = childRecords.map(record => record.height);
    const weights = childRecords.map(record => record.weight);
    
    // 配置图表
    const chartConfig = {
        type: 'line',
        data: {
            labels: labels,
            datasets: []
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `${child.name}的成长曲线`,
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    color: '#1d1d1f',
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: '数值',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#86868b'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        },
                        color: '#86868b'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '日期',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        color: '#86868b'
                    },
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        color: '#86868b',
                        maxRotation: 45,
                        minRotation: 0
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            elements: {
                point: {
                    radius: 5,
                    hoverRadius: 7,
                    borderWidth: 2
                },
                line: {
                    borderWidth: 3
                }
            }
        }
    };
    
    // 根据图表类型添加数据集
    if (chartType === 'height' || chartType === 'both') {
        chartConfig.data.datasets.push({
            label: '身高 (cm)',
            data: heights,
            borderColor: '#0071e3',
            backgroundColor: 'rgba(0, 113, 227, 0.1)',
            tension: 0.4,
            pointBackgroundColor: '#0071e3',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
        });
        
        // 添加标准身高对比
        if (child.birthday) {
            const standardHeights = [];
            const standardHeightsMin = [];
            const standardHeightsMax = [];
            
            childRecords.forEach(record => {
                const recordDate = new Date(record.date);
                const ageMonths = calculateAgeInMonths(child.birthday, recordDate);
                const standardHeight = getStandardHeight(ageMonths, child.gender);
                
                if (standardHeight) {
                    standardHeights.push(standardHeight.avg);
                    standardHeightsMin.push(standardHeight.min);
                    standardHeightsMax.push(standardHeight.max);
                } else {
                    standardHeights.push(null);
                    standardHeightsMin.push(null);
                    standardHeightsMax.push(null);
                }
            });
            
            // 添加标准身高平均值曲线
            chartConfig.data.datasets.push({
                label: '标准身高 (cm)',
                data: standardHeights,
                borderColor: '#ff9500',
                backgroundColor: 'rgba(255, 149, 0, 0.1)',
                borderDash: [5, 5],
                tension: 0.4,
                fill: false
            });
            
            // 添加标准身高范围
            chartConfig.data.datasets.push({
                label: '标准范围 (cm)',
                data: standardHeightsMax,
                borderColor: 'rgba(255, 149, 0, 0.3)',
                backgroundColor: 'rgba(255, 149, 0, 0.1)',
                borderDash: [5, 5],
                tension: 0.4,
                fill: '+1'
            });
            
            chartConfig.data.datasets.push({
                label: '标准范围 (cm)',
                data: standardHeightsMin,
                borderColor: 'rgba(255, 149, 0, 0.3)',
                backgroundColor: 'rgba(255, 149, 0, 0.1)',
                borderDash: [5, 5],
                tension: 0.4,
                fill: false
            });
        }
    }
    
    if (chartType === 'weight' || chartType === 'both') {
        chartConfig.data.datasets.push({
            label: '体重 (斤)',
            data: weights,
            borderColor: '#34c759',
            backgroundColor: 'rgba(52, 199, 89, 0.1)',
            tension: 0.4,
            pointBackgroundColor: '#34c759',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
        });
    }
    
    // 创建图表
    if (typeof Chart !== 'undefined') {
        currentChart = new Chart(ctx, chartConfig);
    } else {
        alert('图表库未加载，请检查网络连接');
    }
}

// 计算指定日期的年龄（按月）
function calculateAgeInMonths(birthday, targetDate = new Date()) {
    if (!birthday) return 0;
    
    const birthDate = new Date(birthday);
    const today = new Date(targetDate);
    
    let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
    months -= birthDate.getMonth();
    months += today.getMonth();
    
    return Math.max(0, Math.min(150, months)); // 限制在0-150个月之间
}

// 格式化年龄显示
function formatAge(months) {
    if (months === 0) return '未设置';
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) {
        return `${remainingMonths}个月`;
    } else if (remainingMonths === 0) {
        return `${years}岁`;
    } else {
        return `${years}岁${remainingMonths}个月`;
    }
}

// 更新统计信息
function updateStats() {
    const analysisChildSelect = document.getElementById('analysis-child-select');
    const statsContainer = document.getElementById('stats-container');
    
    if (!analysisChildSelect || !statsContainer) return;
    
    const childIndex = parseInt(analysisChildSelect.value);
    const child = children[childIndex];
    
    const childRecords = growthData.filter(record => record.childId === child.id);
    
    if (childRecords.length === 0) {
        statsContainer.innerHTML = '<p>暂无数据，请先添加记录</p>';
        return;
    }
    
    // 按日期排序
    childRecords.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const firstRecord = childRecords[0];
    const lastRecord = childRecords[childRecords.length - 1];
    
    const heightGrowth = (parseFloat(lastRecord.height) - parseFloat(firstRecord.height)).toFixed(1);
    const weightGrowth = (parseFloat(lastRecord.weight) - parseFloat(firstRecord.weight)).toFixed(1);
    
    const startDate = new Date(firstRecord.date);
    const endDate = new Date(lastRecord.date);
    const recordSpan = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    const statsHtml = `
        <div class="stat-card">
            <h3>最新记录</h3>
            <p>${lastRecord.date}</p>
        </div>
        <div class="stat-card">
            <h3>最新身高</h3>
            <p>${lastRecord.height} cm</p>
        </div>
        <div class="stat-card">
            <h3>最新体重</h3>
            <p>${lastRecord.weight} 斤</p>
        </div>
        <div class="stat-card">
            <h3>身高增长</h3>
            <p>${heightGrowth} cm</p>
        </div>
        <div class="stat-card">
            <h3>体重增长</h3>
            <p>${weightGrowth} 斤</p>
        </div>
        <div class="stat-card">
            <h3>记录次数</h3>
            <p>${childRecords.length} 次</p>
        </div>
        <div class="stat-card">
            <h3>记录跨度</h3>
            <p>${recordSpan} 天</p>
        </div>
    `;
    
    statsContainer.innerHTML = statsHtml;
}

// 编辑孩子信息
function editChild(index) {
    editingChildIndex = index;
    const child = children[index];
    
    // 填充表单
    const editName = document.getElementById('edit-name');
    const editBirthday = document.getElementById('edit-birthday');
    const editAgeYears = document.getElementById('edit-age-years');
    const editAgeMonths = document.getElementById('edit-age-months');
    const editGender = document.getElementById('edit-gender');
    const avatarOptions = document.querySelectorAll('input[name="avatar"]');
    const editDialog = document.getElementById('edit-dialog');
    
    if (editName) editName.value = child.name;
    if (editBirthday) editBirthday.value = child.birthday;
    if (editAgeYears) editAgeYears.value = ''; // 清空年龄输入框
    if (editAgeMonths) editAgeMonths.value = ''; // 清空年龄输入框
    if (editGender) editGender.value = child.gender;
    
    // 选择头像
    avatarOptions.forEach(option => {
        option.checked = option.value === (child.avatar || 'default');
    });
    
    if (editDialog) editDialog.classList.add('show');
}

// 关闭编辑对话框
function closeEditDialog() {
    const editDialog = document.getElementById('edit-dialog');
    if (editDialog) editDialog.classList.remove('show');
    editingChildIndex = null;
}

// 保存孩子信息
function saveChild() {
    const editName = document.getElementById('edit-name');
    const editBirthday = document.getElementById('edit-birthday');
    const editAgeYears = document.getElementById('edit-age-years');
    const editAgeMonths = document.getElementById('edit-age-months');
    const editGender = document.getElementById('edit-gender');
    const avatarOptions = document.querySelectorAll('input[name="avatar"]');
    
    if (!editName) return;
    
    const name = editName.value;
    let birthday = editBirthday ? editBirthday.value : '';
    const gender = editGender ? editGender.value : 'female';
    
    // 获取选中的头像
    let avatar = 'default';
    avatarOptions.forEach(option => {
        if (option.checked) {
            avatar = option.value;
        }
    });
    
    if (!name) {
        alert('请输入孩子姓名');
        return;
    }
    
    // 如果填写了年龄，自动计算出生日期
    if (editAgeYears && editAgeMonths) {
        const years = parseInt(editAgeYears.value) || 0;
        const months = parseInt(editAgeMonths.value) || 0;
        const ageMonths = years * 12 + months;
        
        if (ageMonths > 0) {
            const calculatedBirthday = new Date();
            calculatedBirthday.setMonth(calculatedBirthday.getMonth() - ageMonths);
            birthday = calculatedBirthday.toISOString().split('T')[0];
            // 更新出生日期输入框显示
            if (editBirthday) {
                editBirthday.value = birthday;
            }
        }
    }
    
    if (editingChildIndex !== null) {
        // 更新孩子信息
        children[editingChildIndex] = {
            ...children[editingChildIndex],
            name: name,
            birthday: birthday,
            gender: gender,
            avatar: avatar
        };
        
        // 保存数据
        saveData();
        
        // 更新选择器
        updateChildSelectors();
        
        // 关闭对话框
        closeEditDialog();
        
        // 显示成功消息
        alert('保存成功！');
        
        // 更新页面
        updateHomePage();
        updateHistoryRecords();
        drawChart();
        updateHeightReference();
        updateWeightReference();
        updateChildList();
    }
}

// 更新孩子列表显示
function updateChildList() {
    const childList = document.querySelector('.child-list');
    if (!childList) return;
    
    let html = '';
    children.forEach((child, index) => {
        const ageMonths = calculateAgeInMonths(child.birthday);
        const ageDisplay = formatAge(ageMonths);
        
        html += `
            <div class="list-item">
                <div class="list-item-content">
                    <h3>
                        <span class="child-avatar">
                            <i class="fas ${child.avatar === 'default' ? 'fa-baby' : 
                                     child.avatar === 'avatar1' ? 'fa-child' : 
                                     child.avatar === 'avatar2' ? 'fa-baby-carriage' : 
                                     child.avatar === 'avatar3' ? 'fa-star' : 
                                     child.avatar === 'avatar4' ? 'fa-heart' : 'fa-baby'}"></i>
                        </span>
                        ${child.name}
                    </h3>
                    <p>${ageDisplay}</p>
                </div>
                <div class="list-item-actions">
                    <button class="button small" onclick="editChild(${index})"><i class="fas fa-edit"></i> 编辑</button>
                </div>
            </div>
        `;
    });
    
    childList.innerHTML = html;
}

// 导出数据
function exportData() {
    if (growthData.length === 0) {
        alert('暂无数据可导出');
        return;
    }
    
    // 按孩子分组导出
    children.forEach(child => {
        const childRecords = growthData.filter(record => record.childId === child.id);
        if (childRecords.length > 0) {
            // 生成CSV格式数据，包含标准身高参考
            let csvContent = `孩子姓名,出生日期,性别,记录日期,年龄(月),身高(cm),体重(kg),标准身高平均值(cm),标准身高范围(cm)\n`;
            
            childRecords.forEach(record => {
                const recordDate = new Date(record.date);
                const ageMonths = calculateAgeInMonths(child.birthday, recordDate);
                const standardHeight = getStandardHeight(ageMonths, child.gender);
                
                const standardHeightAvg = standardHeight ? standardHeight.avg : '';
                const standardHeightRange = standardHeight ? `${standardHeight.min}-${standardHeight.max}` : '';
                
                csvContent += `${record.childName},${child.birthday || ''},${child.gender === 'female' ? '女' : '男'},${record.date},${ageMonths},${record.height},${record.weight},${standardHeightAvg},${standardHeightRange}\n`;
            });
            
            // 创建下载链接
            const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
            const link = document.createElement('a');
            link.setAttribute('href', encodedUri);
            link.setAttribute('download', `${child.name}_成长记录_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            
            // 触发下载
            link.click();
            
            // 清理
            document.body.removeChild(link);
        }
    });
    
    alert('数据导出成功！');
}

// 生成Excel文件（CSV格式，可被Excel打开）
function generateExcelFile() {
    if (growthData.length === 0) {
        alert('暂无数据可生成');
        return;
    }
    
    // 生成详细的CSV文件，包含所有孩子的数据和标准身高参考
    let csvContent = `宝贝成长记录,生成日期: ${new Date().toISOString().split('T')[0]}\n\n`;
    
    children.forEach(child => {
        const childRecords = growthData.filter(record => record.childId === child.id);
        if (childRecords.length > 0) {
            csvContent += `${child.name}的成长记录\n`;
            csvContent += `出生日期: ${child.birthday || '未设置'}\n`;
            csvContent += `性别: ${child.gender === 'female' ? '女' : '男'}\n\n`;
            csvContent += `记录日期,年龄(月),身高(cm),体重(kg),标准身高平均值(cm),标准身高范围(cm),身高评价\n`;
            
            childRecords.forEach(record => {
                const recordDate = new Date(record.date);
                const ageMonths = calculateAgeInMonths(child.birthday, recordDate);
                const standardHeight = getStandardHeight(ageMonths, child.gender);
                
                const standardHeightAvg = standardHeight ? standardHeight.avg : '';
                const standardHeightRange = standardHeight ? `${standardHeight.min}-${standardHeight.max}` : '';
                let heightEvaluation = '';
                
                if (standardHeight) {
                    if (record.height < standardHeight.min) {
                        heightEvaluation = '偏低';
                    } else if (record.height > standardHeight.max) {
                        heightEvaluation = '偏高';
                    } else {
                        heightEvaluation = '正常';
                    }
                }
                
                csvContent += `${record.date},${ageMonths},${record.height},${record.weight},${standardHeightAvg},${standardHeightRange},${heightEvaluation}\n`;
            });
            
            csvContent += '\n\n';
        }
    });
    
    // 创建下载链接
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `宝贝成长记录_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    // 触发下载
    link.click();
    
    // 清理
    document.body.removeChild(link);
    
    alert('Excel文件生成成功！');
}

// 清空数据
function clearData() {
    showConfirmDialog('确定要清空所有记录数据吗？此操作不可恢复。', () => {
        growthData = [];
        saveData();
        updateHomePage();
        updateHistoryRecords();
        drawChart();
        updateStats();
        alert('数据已清空');
    });
}

// 响应式处理
window.addEventListener('resize', () => {
    if (currentChart) {
        currentChart.resize();
    }
});

// 深色模式检测
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    // 深色模式变化时的处理
    updateHomePage();
    updateHistoryRecords();
    updateStats();
    drawChart();
});

// 云端账号系统

// 显示登录表单
function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
}

// 显示注册表单
function showRegisterForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
}

// 处理登录
function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const loginError = document.getElementById('login-error');
    
    if (loginError) loginError.textContent = '';
    
    if (!email) {
        if (loginError) loginError.textContent = '请输入邮箱';
        return;
    }
    
    if (!password) {
        if (loginError) loginError.textContent = '请输入密码';
        return;
    }
    
    const result = authManager.login(email, password);
    
    if (result.success) {
        showApp();
    } else {
        if (loginError) loginError.textContent = result.message;
    }
}

// 处理注册
function handleRegister() {
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const token = document.getElementById('register-token').value.trim();
    const registerError = document.getElementById('register-error');
    
    if (registerError) registerError.textContent = '';
    
    if (!email) {
        if (registerError) registerError.textContent = '请输入邮箱';
        return;
    }
    
    if (!password) {
        if (registerError) registerError.textContent = '请输入密码';
        return;
    }
    
    if (password !== confirmPassword) {
        if (registerError) registerError.textContent = '两次输入的密码不一致';
        return;
    }
    
    if (!token) {
        if (registerError) registerError.textContent = '请输入GitHub Token';
        return;
    }
    
    const result = authManager.register(email, password, token);
    
    if (result.success) {
        // 注册成功后自动登录
        const loginResult = authManager.login(email, password);
        if (loginResult.success) {
            showApp();
        }
    } else {
        if (registerError) registerError.textContent = result.message;
    }
}

// 显示应用
function showApp() {
    document.getElementById('login-screen').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
    initApp();
    updateUserInfo();
}

// 更新用户信息显示
function updateUserInfo() {
    const userInfoElement = document.getElementById('user-info');
    const currentUser = authManager.getCurrentUser();
    
    if (userInfoElement && currentUser) {
        userInfoElement.innerHTML = `
            <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1d1d1f;">
                <i class="fas fa-envelope" style="margin-right: 8px; color: #0071e3;"></i>
                ${currentUser.email}
            </p>
            <p style="margin: 0; font-size: 12px; color: #86868b;">
                注册时间：${new Date(currentUser.createdAt).toLocaleDateString('zh-CN')}
            </p>
        `;
    }
}

// 添加孩子
function addChild() {
    editingChildIndex = null;
    
    // 清空表单
    const editName = document.getElementById('edit-name');
    const editBirthday = document.getElementById('edit-birthday');
    const editAgeYears = document.getElementById('edit-age-years');
    const editAgeMonths = document.getElementById('edit-age-months');
    const editGender = document.getElementById('edit-gender');
    const avatarOptions = document.querySelectorAll('input[name="avatar"]');
    const editDialog = document.getElementById('edit-dialog');
    
    if (editName) editName.value = '';
    if (editBirthday) editBirthday.value = '';
    if (editAgeYears) editAgeYears.value = '';
    if (editAgeMonths) editAgeMonths.value = '';
    if (editGender) editGender.value = 'female';
    
    // 选择默认头像
    avatarOptions.forEach(option => {
        option.checked = option.value === 'default';
    });
    
    if (editDialog) editDialog.classList.add('show');
}

// 登出
function handleLogout() {
    authManager.logout();
    document.getElementById('login-screen').style.display = 'flex';
    document.querySelector('.container').style.display = 'none';
    showLoginForm();
}

// 页面加载时检查登录状态
window.addEventListener('DOMContentLoaded', () => {
    const currentUser = authManager.getCurrentUser();
    if (currentUser) {
        showApp();
    } else {
        document.getElementById('login-screen').style.display = 'flex';
    }
});

// 分享功能

// 打开分享对话框
function generateShareLink() {
    const shareDialog = document.getElementById('share-dialog');
    if (shareDialog) {
        shareDialog.classList.add('show');
    }
}

// 关闭分享对话框
function closeShareDialog() {
    const shareDialog = document.getElementById('share-dialog');
    if (shareDialog) {
        shareDialog.classList.remove('show');
    }
    
    // 清空输入框
    const sharePassword = document.getElementById('share-password');
    if (sharePassword) {
        sharePassword.value = '';
    }
    
    // 隐藏链接容器
    const shareLinkContainer = document.getElementById('share-link-container');
    if (shareLinkContainer) {
        shareLinkContainer.style.display = 'none';
    }
}

// 创建分享链接
function createShareLink() {
    const sharePassword = document.getElementById('share-password').value;
    
    if (!sharePassword || sharePassword.length < 4) {
        alert('请输入至少4位的访问密码');
        return;
    }
    
    const result = cloudDataManager.generateShareLink(sharePassword);
    
    if (result.success) {
        // 显示链接
        const shareLinkContainer = document.getElementById('share-link-container');
        const shareLinkInput = document.getElementById('share-link');
        
        if (shareLinkContainer && shareLinkInput) {
            shareLinkInput.value = result.shareLink;
            shareLinkContainer.style.display = 'block';
            
            // 自动复制到剪贴板
            shareLinkInput.select();
            document.execCommand('copy');
            
            alert('分享链接已生成并复制到剪贴板！\n\n请将链接和访问密码分享给家人朋友。');
        }
    } else {
        alert('生成分享链接失败：' + result.message);
    }
}

// 检查URL中是否有分享参数
function checkShareLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const shareId = urlParams.get('share');
    
    if (shareId) {
        // 显示分享访问对话框
        showShareAccessDialog(shareId);
    }
}

// 显示分享访问对话框
function showShareAccessDialog(shareId) {
    const shareAccessHtml = `
        <div id="share-access-dialog" class="dialog show">
            <div class="dialog-content">
                <h2><i class="fas fa-lock"></i> 访问分享数据</h2>
                <p>请输入访问密码查看分享的数据</p>
                
                <div class="input-group">
                    <label for="share-access-password">访问密码</label>
                    <input type="password" id="share-access-password" class="input" placeholder="请输入访问密码">
                </div>
                
                <div class="button-group">
                    <button class="button" onclick="accessShare('${shareId}')">访问</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', shareAccessHtml);
}

// 访问分享数据
async function accessShare(shareId) {
    const password = document.getElementById('share-access-password').value;
    
    if (!password) {
        alert('请输入访问密码');
        return;
    }
    
    const result = await cloudDataManager.accessShareData(shareId, password);
    
    if (result.success) {
        // 显示分享的数据
        displayShareData(result.data);
        
        // 移除访问对话框
        const shareAccessDialog = document.getElementById('share-access-dialog');
        if (shareAccessDialog) {
            shareAccessDialog.remove();
        }
    } else {
        alert('访问失败：' + result.message);
    }
}

// 显示分享的数据
function displayShareData(data) {
    if (!data) {
        alert('没有可显示的数据');
        return;
    }
    
    // 隐藏登录界面
    document.getElementById('login-screen').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
    
    // 加载分享的数据
    if (data.children) {
        children = data.children;
    }
    if (data.growthData) {
        growthData = data.growthData;
    }
    
    // 更新页面（只读模式）
    updateHomePage();
    updateHistoryRecords();
    updateStats();
    drawChart();
    
    // 显示提示
    alert('您正在查看分享的数据（只读模式）');
}

// 页面加载时检查分享链接
window.addEventListener('DOMContentLoaded', checkShareLink);

// 数据导入功能

// 处理导入文件
function handleImportFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (fileExtension === 'csv') {
        importCSV(file);
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        importExcel(file);
    } else {
        alert('不支持的文件格式，请使用CSV或Excel文件');
    }
    
    // 清空文件选择
    event.target.value = '';
}

// 导入CSV文件
function importCSV(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const content = e.target.result;
            const lines = content.split('\n');
            
            let importedCount = 0;
            let errorCount = 0;
            const childrenMap = {}; // 用于统计每个孩子的导入数量
            
            // 跳过标题行，从第二行开始
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                // 解析CSV行（支持逗号或制表符分隔）
                let values;
                if (line.includes('\t')) {
                    values = line.split('\t');
                } else if (line.includes(',')) {
                    values = line.split(',');
                } else if (line.includes(';')) {
                    values = line.split(';');
                } else {
                    errorCount++;
                    continue;
                }
                
                if (values.length >= 4) {
                    const dateStr = values[0].trim();
                    const childName = values[1].trim();
                    const height = parseFloat(values[2].trim());
                    const weight = parseFloat(values[3].trim());
                    
                    // 解析日期格式（支持多种格式）
                    const date = parseDate(dateStr);
                    
                    // 验证数据
                    if (date && childName && !isNaN(height) && !isNaN(weight)) {
                        // 查找或创建孩子
                        let child = children.find(c => c.name === childName);
                        if (!child) {
                            child = {
                                id: children.length,
                                name: childName,
                                birthday: '',
                                gender: 'female',
                                avatar: 'default'
                            };
                            children.push(child);
                        }
                        
                        // 创建记录
                        const record = {
                            id: Date.now() + i,
                            childId: child.id,
                            childName: childName,
                            date: date,
                            height: height,
                            weight: weight
                        };
                        
                        // 检查是否已存在相同日期的记录
                        const existingRecord = growthData.find(r => 
                            r.childId === child.id && r.date === date
                        );
                        
                        if (!existingRecord) {
                            growthData.push(record);
                            importedCount++;
                            
                            // 统计每个孩子的导入数量
                            childrenMap[childName] = (childrenMap[childName] || 0) + 1;
                        } else {
                            errorCount++;
                        }
                    } else {
                        errorCount++;
                    }
                } else {
                    errorCount++;
                }
            }
            
            // 保存数据
            saveData();
            
            // 更新页面
            updateChildSelectors();
            updateHomePage();
            updateHistoryRecords();
            updateStats();
            drawChart();
            
            // 生成统计信息
            let statsText = `导入完成！\n成功导入：${importedCount} 条记录\n跳过重复：${errorCount} 条记录\n\n`;
            for (const [name, count] of Object.entries(childrenMap)) {
                statsText += `${name}：${count} 条记录\n`;
            }
            
            alert(statsText);
        } catch (error) {
            console.error('导入错误：', error);
            alert('导入失败：文件格式错误\n\n请确保CSV文件格式正确：\n时间,姓名,身高,体重');
        }
    };
    reader.readAsText(file);
}

// 解析日期格式（支持多种格式）
function parseDate(dateStr) {
    if (!dateStr) return null;
    
    // 尝试解析 "2024年2月18日 16:21" 格式
    const chineseMatch = dateStr.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
    if (chineseMatch) {
        const year = chineseMatch[1];
        const month = chineseMatch[2].padStart(2, '0');
        const day = chineseMatch[3].padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // 尝试解析 "2024-02-18" 或 "2024/02/18" 格式
    const standardMatch = dateStr.match(/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);
    if (standardMatch) {
        const year = standardMatch[1];
        const month = standardMatch[2].padStart(2, '0');
        const day = standardMatch[3].padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // 尝试解析 "02/18/2024" 格式
    const usMatch = dateStr.match(/(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/);
    if (usMatch) {
        const month = usMatch[1].padStart(2, '0');
        const day = usMatch[2].padStart(2, '0');
        const year = usMatch[3];
        return `${year}-${month}-${day}`;
    }
    
    return null;
}

// 导入Excel文件（简化版，仅支持CSV格式）
function importExcel(file) {
    // 由于浏览器环境限制，Excel文件需要转换为CSV格式
    alert('提示：Excel文件请先另存为CSV格式再导入\n\n支持的CSV格式：\n日期,孩子姓名,身高(cm),体重(斤)\n2024-01-01,大宝,100,40');
}

// 生成导入模板
function downloadImportTemplate() {
    const template = `日期,孩子姓名,身高(cm),体重(斤)
2024-01-01,大宝,100,40
2024-01-15,大宝,101,41
2024-02-01,小宝,80,30`;
    
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '导入模板.csv';
    link.click();
}