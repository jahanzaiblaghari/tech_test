import React from 'react';
import { NetStatusEvent, netStatusService } from '../../services/netStatusService.js';
import PopUp from "./popup.js"; 
import {
  CryptoChart,
  enrichDataSeriesWithDefaultOptions,
  flagBuySeries,
  flagSaleSeries,
  getCrosshairConfig,
} from '../Chart/Chart.js';
import { binanceService, BinanceServiceEvent } from '../../services/binance.service.js';

import './App.css';


const SymbolPair = {
  BTCUSDT: 'BTCUSDT',
};
const PAIR_DEFAULT = SymbolPair.BTCUSDT;
const pairTitleMap = {
  [SymbolPair.BTCUSDT]: 'BTC/USDT',
};

const NOTIFICATION_TEXT_DEFAULT = '';
const TEXT_API_UNAVAILABLE = 'Binance api is unavailable.';
class App extends React.Component {
  currentSymbolPair = PAIR_DEFAULT;
  bidStart;
  state = {
    initialized: false,
    dealShow: false,
    seen: false,
    notificationShow: false,
    notificationText: NOTIFICATION_TEXT_DEFAULT,
  };
  chartRef = React.createRef();

  constructor(props) {
    super(props);
    netStatusService.on(NetStatusEvent.ONLINE, this.handleOnlineStatus);
    netStatusService.on(NetStatusEvent.OFFLINE, this.handleOfflineStatus);
  }

  componentDidMount() {
    this.init();
  }
  togglePop = () => {
    this.setState({
     seen: !this.state.seen
    });
   };

  handleOnlineStatus = () => {
    const { initialized } = this.state;
    if (initialized) {
    
    } else {
      this.init();
    }
  };


  setInitialData(data) {
    const chart = this.chartRef.current.chart;
    chart.update({
      series: [
        enrichDataSeriesWithDefaultOptions({ data }),
        flagBuySeries,
        flagSaleSeries,
      ],
      ...getCrosshairConfig(),
    }, true, true, true);
  }

  setIncrementalDataPoint(dataPoint) {
   

    const chart = this.chartRef.current.chart;
    const series = chart.series[0];
    series.addPoint(dataPoint, true, false, true);
    // series.removePoint(0, true, true);
    chart.series[1].update();
    chart.series[2].update();
  }

 

  init() {
    this.initStreamHandlers();
    binanceService
      .getInitialData(this.currentSymbolPair)
      .then((data) => {
        this.setState({ initialized: true });
        this.setInitialData(data);
     
        this.connectToStream();
      })
      .catch((error) => {
        // there are all errors from `then`'s
        // treat them as binance unavailable.
        this.setState({ initialized: false });
        this.setState({ notificationText: TEXT_API_UNAVAILABLE });
      
      });
  }

  connectToStream() {
    binanceService.connectToStream(this.currentSymbolPair);
  }

  initStreamHandlers() {
    binanceService.on(BinanceServiceEvent.MESSAGE, this.handleStreamMessage);
    
  }

  handleStreamMessage = (dataPoint) => {
   
    const chart = this.chartRef.current.chart;
    const series = chart.series[0];
    if (series) {
      this.setIncrementalDataPoint(dataPoint);
    } else {
      this.setInitialData([dataPoint]);
    }
  };

  


  render() {
    
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-title">BTC/USDT live chart</div>
          <button className="ip_details" onClick={this.togglePop}>Get IP details</button>
        </header>
        <div className="App-main-wrapper">
          <div className="App-sidebar-left" />
          <div className="App-main">
            <CryptoChart
              title={pairTitleMap[this.currentSymbolPair]}
              ref={this.chartRef}
            />
           
          </div>
          {this.state.seen ? <PopUp toggle={this.togglePop} /> : null}
          <div className="App-sidebar-right" />
        </div>
        
       
      </div>
    );
  }
}

export default App;
