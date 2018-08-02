import React, { Component } from 'react';
import './App.css';
import mainData from './Data.json';

let ProductsData = mainData.productsList;

class App extends Component {

  constructor(){
    super();
    this.state = {selection: 0};
    this.CheckKeyPress = this.CheckKeyPress.bind(this);
    this.getCurrentSelection = this.getCurrentSelection.bind(this);
  }

  componentWillMount(){
    document.addEventListener('keyup', this.CheckKeyPress, false);
  }

  componentDidMount(){
    document.getElementById('ProfileSection').style.display = 'none'; 
  }

  getCurrentSelection(){
      var item = document.getElementsByClassName('active');
      if( item.length === 0 ){
        return 1;
      }else{
        return item[0].id;
      }
  }

  CheckKeyPress(e){
    if(e.target.id === 'Home'){
      var item = this.getCurrentSelection();
      var sel = item;  
    
      if( e.keyCode === 40 || e.keyCode === 38 || e.keyCode === 9 ){
          if( e.keyCode === 40){
                if( this.state.selection < ProductsData.length ){
                  sel = ProductsData[this.state.selection].ProductID;
                }else if(this.state.selection === ProductsData.length ){
                  sel = ProductsData[this.state.selection-1].ProductID;
                }
          }else if( e.keyCode === 38 ){
              if( this.state.selection > 1 ){
                  sel = ProductsData[this.state.selection-2].ProductID;
              }else if( this.state.selection == 1 ){
                  sel = ProductsData[0].ProductID;
              }
          }
          this.setState({selection: sel});
          document.getElementById(sel).focus();   
          document.getElementById('ProfileSection').style.display = 'none';  
      }else if( e.keyCode === 39 ){
         if(sel == 1){
          document.getElementById('Profile').focus();
          document.getElementById('ProductSection').style.display = 'none';     
          document.getElementById('ProfileSection').style.display = 'block';    
          document.getElementById('ProfileSection').style.color = '#3399ff';    
          document.getElementById('ProfileSection').innerText = 'Profile Information';          
         }else{
               this.setState({selection: sel});
               document.getElementById(sel).focus();
         }              
      }else if( e.keyCode === 37 ){
          this.setState({selection: sel});
          document.getElementById(sel).focus();
      }

    }else if (e.target.id === 'Profile'){
      if( e.keyCode === 37 ){
        document.getElementById('Home').focus();
        document.getElementById('ProfileSection').style.display = 'none';   
        document.getElementById('ProductSection').style.display = 'block'; 
        this.setState({ selection: 1 });
      }
    }
  }

  render() {

    let Products = ProductsData.map( (value,index) => {
        if( this.state.selection == value.ProductID ){
          return <div id={value.ProductID} className='ProdList active' style={{padding: '12px' }} align='left' >
                      <div>ID: {value.ProductID}</div>
                      <div>Name: {value.ProductName}</div>
                 </div>
        }else{
          return <div id={value.ProductID} className='ProdList' style={{padding: '12px' }} align='left' >
                      <div>ID: {value.ProductID}</div>
                      <div>Name: {value.ProductName}</div>
                 </div>
        }
    });

    return (
      <div className="App" style={{position:'relative' }} >
          <div style={{position:'absolute', margin: 'auto', border:'1px solid grey', width:'250px',
                       top: '50%', left: '50%',transform: 'translate(-50%, 50%)' }} >
              <div style={{width:'100%', height:'100%'}}  >
                <input type='button' id='Home' value='Home' style={{width:'50%',height:'50px', backgroundColor: '#99cc00'}} />
                <input type='button' id='Profile' style={{marginLeft:'0px', width:'50%',height:'50px', backgroundColor: 'orange'}} value='Profile' />
              </div>
              <div id='ProductSection' >
                {Products}
              </div>
              <div id='ProfileSection' style={{height: '205px', padding: '20px 0px' }} >
              </div>
          </div>

      </div>
    );
  }
}

export default App;
