const ksm_icon = require('./../../assets/images/kusama.svg')
const kusama_button = require('./../../assets/images/kusama-button.png')
const kusama_m_button = require('./../../assets/images/kusama-button-mobile.png')
const polkadot_icon = require('./../../assets/images/polkadot.svg')
const polkadot_button = require('./../../assets/images/polkadot-button.png')
const polkadot_m_button = require('./../../assets/images/polkadot-button-mobile.png')

export default [{
    name: 'polkadot',
    value: {
      balances: {
        value: "DOT",
        icon: polkadot_icon
      },
      inflation: "10",
      button: polkadot_button,
      mobileButton: polkadot_m_button,
      hasPrice: true,
      hasVoteBanner: true,
      label: "Polkadot",
      network: "polkadot",
      chain: "Polkadot",
      type: "mainnet",
      color: "#E90979",
      arrowColor: "#E6017A",
      colorMap: ["#E90979", "#F081B9", "#d7d7d7"],
      domain: {
        value: 'https://polkadot.subscan.io'
      },
      ws: {
        value: "wss://polkadot.subscan.io/socket"
      },
      official_site: {
        value: 'https://polkadot.network/'
      },
      white_paper: {
        value: 'https://polkadot.network/PolkaDotPaper.pdf'
      },
      telegram: {
        value: 'https://t.me/polkadotofficial',
      },
      twitter: {
        value: 'https://twitter.com/Polkadot',
      },
      github: {
        value: 'https://github.com/paritytech/polkadot'
      },
      price_link: {
        value: 'https://coinmarketcap.com/currencies/polkadot-iou/'
      },
      donate: {
        address: '14RYaXRSqb9rPqMaAVp1UZW2czQ6dMNGMbvukwfifi6m8ZgZ'
      }
    }
  },
  {
    name: 'kusama',
    value: {
      balances: {
        value: "KSM",
        icon: ksm_icon
      },
      inflation: "10",
      button: kusama_button,
      mobileButton: kusama_m_button,
      hasPrice: true,
      hasVoteBanner: true,
      label: "Kusama",
      network: "kusama",
      chain: "Kusama",
      type: "mainnet",
      color: "#E90979",
      arrowColor: "#000",
      colorMap: ["#E90979", "#F081B9", "#d7d7d7"],
      domain: {
        value: 'https://kusama.subscan.io'
      },
      ws: {
        value: "wss://kusama.subscan.io/socket"
      },
      official_site: {
        value: 'https://kusama.network/'
      },
      white_paper: {
        value: ''
      },
      telegram: {
        value: 'https://t.me/kusamanetworkofficial',
      },
      twitter: {
        value: 'https://twitter.com/kusamanetwork',
      },
      github: {
        value: 'https://github.com/paritytech/polkadot/'
      },
      price_link: {
        value: 'https://coinmarketcap.com/currencies/kusama/'
      },
      donate: {
        address: 'Fzs6WWFcAuJhxAVyZa4EN2suxggjidJjV3AzJxKbRHjh2Jc'
      }
    }
  }
]
