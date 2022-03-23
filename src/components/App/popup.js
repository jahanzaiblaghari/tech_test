import React, { Component } from "react";
export default class PopUp extends Component {
  state = {
    ip: "",
    response: "",
    ipdetails:{},
    city:"",
    region:"",
    country:"",
    loc:"",
    org:"",
    timezone:"",
  };
  handleClick = () => {
   this.props.toggle();
  };
  handleChange = event =>{
    this.setState({ [event.target.name]:event.target.value })
    }
   getIpDetails = event =>{
    event.preventDefault();
    console.log("ip : " + this.state.ip)
    // const { ip } = this.state;
    fetch('https://ipinfo.io/'+this.state.ip+'/geo?token=0721b0c151bca8')
     .then(res => res.json())
     .then(result => this.setState({ipdetails: (result)}, () => console.log('fetched...', result)));
  }
render() {
  return (
   <div className="modal popupmodal">
     <div className="modal_content">
     <span className="close" onClick={this.handleClick}>&times;    </span>
     <div className="content_modal">
        <h2>Enter Ip to get Geo-location details</h2>
        <form onSubmit={this.getIpDetails}>
        <input type="text" name="ip" onChange={this.handleChange} />
        <input type="submit" value="Get IP Details" /> </form>
        <div className="detailsFetched" >
        { this.state.ipdetails.city && <div>City: {this.state.ipdetails.city}</div>}
        { this.state.ipdetails.country && <div>Country: {this.state.ipdetails.country}</div>}
        { this.state.ipdetails.ip && <div>IP: {this.state.ipdetails.ip}</div>}
        { this.state.ipdetails.loc && <div>Loc: {this.state.ipdetails.loc}</div>}
        { this.state.ipdetails.region && <div>Region: {this.state.ipdetails.region}</div>}
        { this.state.ipdetails.timezone && <div>Timezone: {this.state.ipdetails.timezone}</div>}
        
               
               
             
              
          {/* {this.state.ipdetails} */}
        </div>
      </div>
    </div>
   </div>
  );
 }
}