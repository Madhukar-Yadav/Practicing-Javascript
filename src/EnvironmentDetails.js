import React, { Component } from 'react';
import { connect } from 'react-redux';
import {errorValidataion, toggleSizeButton} from '../../State/actions/sessions';
import Title from 'grommet/components/Title';
import Box from 'grommet/components/Box';
import Article from 'grommet/components/Article';
import Toast from 'grommet/components/Toast';
import Heading from 'grommet/components/Heading';
import CheckBox from 'grommet/components/CheckBox';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Paragraph from 'grommet/components/Paragraph';
import FormField from 'grommet/components/FormField';
import RadioButton from 'grommet/components/RadioButton';
import TextInput from 'grommet/components/TextInput';
import Button from 'grommet/components/Button';
import Form from 'grommet/components/Form';
import Select from 'grommet/components/Select';
import Animate from 'grommet/components/Animate';
import Label from 'grommet/components/Label';
import NumberInput from 'grommet/components/NumberInput';
import FormClose from 'grommet/components/icons/base/FormClose';
import InfoIcon from 'grommet/components/icons/base/CircleInformation';

// import Default_Inputs from '../../Datafiles/Default_Inputs.json';
import SupportedList from '../../Datafiles/SupportedList.json';

// var ToastVisible = false;
   
var ServObj = {};
var lstMemoryDetails = {};

class EnvironmentDetails extends Component {

 constructor(props){
    super(props);
    this.state = { ProdEnv: {}, GrowthYearsList: [], YearlyGrowthPercList: [], ServerPlatformList: [], ServerPlatform: '', 
                  //  ToastVisible: false,
                   Memory32GB: false, Memory64GB: false,
                   Enable32GB: true, Enable64GB: false
                 };
    this.LoadDBSize = this.LoadDBSize.bind(this); 
    this.PercentGrowth = this.PercentGrowth.bind(this); 
    this.onServerPlatformChange = this.onServerPlatformChange.bind(this);    
    this.updateServerList = this.updateServerList.bind(this);
    this.updateProcList = this.updateProcList.bind(this);
    this.updateProcQtyList = this.updateProcQtyList.bind(this);
    this.updateMemoryCalc = this.updateMemoryCalc.bind(this);
    this.updateMemoryQty = this.updateMemoryQty.bind(this);
    this.updateStorageList = this.updateStorageList.bind(this);
 }

 componentWillMount(){
    // Default_Inputs.Sizer.EnvironmentDetails.ComboFields.map( (item, index) => {
      //       switch(item["@name"]){
      //           case "cboGrowthYears": {
      //                this.state.GrowthYearsList = item['DisplayMembers'];
      //                break;
      //           }
      //           case "cboYearlyGrowthPerc": {
      //                this.state.YearlyGrowthPercList = item['DisplayMembers'];
      //                break;
      //           }
      //           // case "cboProcList": {
      //           //      this.state.ProcList = item['DisplayMembers'];
      //           //      break;
      //           // }
      //           default: break;
      //       }
    // });
    // this.state.ServerPlatformList = ['HPE ProLiant DL560 Gen10', 'HPE ProLiant DL580 Gen9'];  

    this.state.GrowthYearsList = ["1","2","3","4","5","6","7","8","9","10"];
    this.state.YearlyGrowthPercList = ["10%","20%","30%","40%","50%","60%","70%","80%","90%","100%"];

    this.state.ServerPlatformList = SupportedList.Server.map( (item, index) => {
        return item['@Name'];
    });
    if(this.props.sizerWorkLoad !== ''){  
      
      this.state.ServerPlatform = this.props.sizerWorkLoad.UserInputs.Environments.ServerPlatform;
      this.state.StorageValue = '';
      // new addition      
      // this.props.activeSession.isSizeEnabled = false;
      if(this.props.activeSession.isSizeEnabled){
         this.props.OntoggleSizeButton(false);
      }
         
      this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['ProdHanaSelected'] = 'HPE ConvergedSystem 500 for SAP HANA Compute Node';
      if(this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['ProcessorSelected'] === undefined){
            this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['ProcessorSelected'] = "Select Processor";
            this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['ProcessorQty'] = '2';      
            this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['MemorySelected'] = '32 GB memory';
            this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['MemoryQty'] = '4';
            this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['Storage'] = 'Regular';            
            
            this.state.ProdEnv = this.props.sizerWorkLoad.UserInputs.Environments['ProductionEnvironment'];         
            
            // var errorObj = { isError:true, errorMsg:'Please select the processor from the dropdown.'};
            // this.props.updateError(errorObj);
      }else{
            this.state.ProdEnv = this.props.sizerWorkLoad.UserInputs.Environments['ProductionEnvironment'];                   
      } 
      
      // var errorObj = { isError: false, errorMsg: '' };
      // if(this.state.ProdEnv['ProcessorSelected'] === "Select Processor"){
      //     if(this.props.activeSession.globalError !== '' && this.props.activeSession.globalError.isError === false){
      //       errorObj = { isError: true, errorMsg: 'Please select the processor from the dropdown.'};
      //       this.props.updateError(errorObj);          
      //       // this.props.OntoggleSizeButton(false);
      //     }
      // }else{
      //       errorObj = { isError: false, errorMsg: '' };          
      //       // this.props.updateError(errorObj);
      //       this.props.activeSession.globalError = { isError:false, errorMsg:''};
      //       // this.props.OntoggleSizeButton(true);          
      // }
        
      var MaxDBSize = this.LoadDBSize( this.state.ProdEnv['DataBaseSize'], 
                                      this.state.ProdEnv['GrowthYears'], 
                                      this.state.ProdEnv['YearlyGrowth'] );  
      // if(parseInt(MaxDBSize, 10) > '6144' ){
      //   this.state.ServerPlatformList = ["No Servers found"];
      // }else if(parseInt(MaxDBSize, 10) > '4096' ){
      //   this.state.ServerPlatformList = ["HPE ProLiant DL560 Gen10"];
      // }else if(parseInt(MaxDBSize, 10) < '4096' ){
      //   this.state.ServerPlatformList = ["HPE ProLiant DL560 Gen10", "HPE ProLiant DL580 Gen9"]        
      // }
      
      // if( this.state.ServerPlatformList.indexOf(this.state.ServerPlatform) === -1 ){
      //     this.state.ServerPlatform = this.state.ServerPlatformList[0];
      // }
      // this.updateProcList(this.state.ServerPlatform, MaxDBSize);        
      this.updateServerList(MaxDBSize);               
    }
 }

 onDataBaseSizeChange(e){
   var Obj = this.state.ProdEnv;
   var reg =/^\d+$/;  
   if(reg.test(e.target.value) || e.target.value === '' ){
      if(e.target.value.length < 5){
        // if(e.target.value < 1 ){
        //   Obj['DataBaseSize'] = 1;
        // }else{
          Obj['DataBaseSize'] = e.target.value;
        // }
      }
   }else{
    //  Obj['DataBaseSize'] = 1;
     Obj['DataBaseSize'] = this.state.ProdEnv['DataBaseSize'];
   }   
    
   this.props.sizerWorkLoad.UserInputs.Environments['ProductionEnvironment'] = Obj;
   // Obj['ProcessorQty'] = this.state.ProcQtyList[0];
    
   this.setState({ ProdEnv: Obj });
 }

 onDBSizeValidate(){
      var Obj = this.state.ProdEnv;
      if( Obj['DataBaseSize'] === '' || parseInt(Obj['DataBaseSize'], 10) === 0 ){
          Obj['DataBaseSize'] = '1';
      }             
      var MaxDBSize = this.LoadDBSize( Obj['DataBaseSize'], 
                                       Obj['GrowthYears'], 
                                       Obj['YearlyGrowth']);
      // if(parseInt(MaxDBSize, 10) > '6144' ){
      //   this.state.ServerPlatformList = ["No Servers found"];
      // }else if(parseInt(MaxDBSize, 10) > '4096' ){
      //   this.state.ServerPlatformList = ["HPE ProLiant DL560 Gen10"];
      // }else if(parseInt(MaxDBSize, 10) < '4096' ){
      //   this.state.ServerPlatformList = ["HPE ProLiant DL560 Gen10", "HPE ProLiant DL580 Gen9"]        
      // }
      
      // if( this.state.ServerPlatformList.indexOf(this.state.ServerPlatform) === -1 ){
      //     this.state.ServerPlatform = this.state.ServerPlatformList[0];
      // }
      // this.updateProcList(this.state.ServerPlatform, MaxDBSize);  
      
      this.updateServerList(MaxDBSize);
      this.setState({ ProdEnv: Obj });
 }

 onGrowthYearsChange(e){
    var Obj = this.state.ProdEnv;
    Obj['GrowthYears'] = e.value;
    this.props.sizerWorkLoad.UserInputs.Environments['ProductionEnvironment'] = Obj;
    Obj['ProcessorQty'] = this.state.ProcQtyList[0];

    var MaxDBSize = this.LoadDBSize( Obj['DataBaseSize'], 
                                      Obj['GrowthYears'], 
                                      Obj['YearlyGrowth']);      
    // if(parseInt(MaxDBSize, 10) > '6144' ){
      //   this.state.ServerPlatformList = ["No Servers found"];
      // }else if(parseInt(MaxDBSize, 10) > '4096' ){
      //   this.state.ServerPlatformList = ["HPE ProLiant DL560 Gen10"];
      // }else if(parseInt(MaxDBSize, 10) < '4096' ){
      //   this.state.ServerPlatformList = ["HPE ProLiant DL560 Gen10", "HPE ProLiant DL580 Gen9"]        
      // }
      
      // if( this.state.ServerPlatformList.indexOf(this.state.ServerPlatform) === -1 ){
      //     this.state.ServerPlatform = this.state.ServerPlatformList[0];
      // }
      // this.updateProcList(this.state.ServerPlatform, MaxDBSize);  
      
    this.updateServerList(MaxDBSize);       
    this.setState({ ProdEnv: Obj });
 }

 onYearlyGrowthPercChange(e){
   var Obj = this.state.ProdEnv;
   Obj['YearlyGrowth'] = e.value;
   this.props.sizerWorkLoad.UserInputs.Environments['ProductionEnvironment'] = Obj;
   Obj['ProcessorQty'] = this.state.ProcQtyList[0];
   
   var MaxDBSize = this.LoadDBSize( Obj['DataBaseSize'], 
                                    Obj['GrowthYears'], 
                                    Obj['YearlyGrowth']);      
   // if(parseInt(MaxDBSize, 10) > '6144' ){
      //   this.state.ServerPlatformList = ["No Servers found"];
      // }else if(parseInt(MaxDBSize, 10) > '4096' ){
      //   this.state.ServerPlatformList = ["HPE ProLiant DL560 Gen10"];
      // }else if(parseInt(MaxDBSize, 10) < '4096' ){
      //   this.state.ServerPlatformList = ["HPE ProLiant DL560 Gen10", "HPE ProLiant DL580 Gen9"]        
      // }
      
      // if( this.state.ServerPlatformList.indexOf(this.state.ServerPlatform) === -1 ){
      //     this.state.ServerPlatform = this.state.ServerPlatformList[0];
      // }
      // this.updateProcList(this.state.ServerPlatform, MaxDBSize);  
      
   this.updateServerList(MaxDBSize);
   this.setState({ ProdEnv: Obj });
 }
 
 onServerPlatformChange(e){
   this.props.sizerWorkLoad.UserInputs.Environments['ServerPlatform'] = e.value; 
   // this.updateProcList(e.value, MaxDBSize);   
   this.state.ServerPlatform = e.value;
   this.updateProcList(e.value);
  //  if( e.value === 'HPE ProLiant DL580 Gen9'){
  //    this.state.StorageList = ['HPE SAP HANA Scale-up Storage'];
  //    this.state.StorageValue = 'HPE SAP HANA Scale-up Storage';
  //  }else{

  //  }
   this.setState({ ServerPlatform: e.value });
 }

 onProcItemChange(e){

   if(e.target != null){
   	var Obj = this.state.ProdEnv;
   	Obj['ProcessorSelected'] = e.value;
   	this.props.sizerWorkLoad.UserInputs.Environments['ProductionEnvironment'] = Obj;
   	var MaxDBSize = this.LoadDBSize( Obj['DataBaseSize'], 
                                    Obj['GrowthYears'], 
                                    Obj['YearlyGrowth']);   
    this.updateProcList(this.state.ServerPlatform, MaxDBSize);  
    // this.updateProcQtyList(this.state.ServerPlatform, DBSize);
    this.onProcQtyChange({value: this.state.ProcQtyList[0]});
    this.setState({ ProdEnv: Obj });

   	// if(this.state.Enable32GB && this.state.Enable64GB){
    //  	 Obj['MemorySelected'] = '32 GB';
   	// }else{
    //   	   if(this.state.Enable32GB){
    //           Obj['MemorySelected'] = '32 GB';
    //        }else{
    //           Obj['MemorySelected'] = '64 GB';
    //        }
    //     }

    //     if(e.value === 'Select Processor' ){     
    //   	    var errorObj = { isError:true, errorMsg:'Please select the processor from the dropdown.'};
    //         this.props.updateError(errorObj);
    //         // this.props.OntoggleSizeButton(false);   
    //     }else{     
    //         var errorObj = { isError:false, errorMsg:''};      
    //         this.props.updateError(errorObj);
    //         // this.props.OntoggleSizeButton(true);        
    //         // this.props.activeSession.globalError = { isError:false, errorMsg:''};
    //     }
    //     this.setState({ ProdEnv: Obj });
   }
 }

 onProcQtyChange(e){
   var Obj = this.state.ProdEnv;
   Obj['ProcessorQty'] = e.value;
   this.props.sizerWorkLoad.UserInputs.Environments['ProductionEnvironment'] = Obj;
   this.state.ProdEnv = Obj;
   var MaxDBSize = this.LoadDBSize( Obj['DataBaseSize'], 
                                    Obj['GrowthYears'], 
                                    Obj['YearlyGrowth']);   
  // this.updateProcList(this.state.ServerPlatform, MaxDBSize);     
  this.updateMemoryCalc(MaxDBSize); 
  this.setState({ ProdEnv: Obj });
 }
 
 onMemoryItemChange(e){
   var Obj = this.state.ProdEnv;
   Obj['MemorySelected'] = e.value;
   this.props.sizerWorkLoad.UserInputs.Environments['ProductionEnvironment'] = Obj;
   this.state.ProdEnv = Obj;
   var MaxDBSize = this.LoadDBSize( Obj['DataBaseSize'], 
                                    Obj['GrowthYears'], 
                                    Obj['YearlyGrowth']);   
   this.updateProcList(MaxDBSize);   
   this.setState({ ProdEnv: Obj });
 }

 onStrgItemChange(e){
   var Obj = this.state.ProdEnv;
   Obj['Storage']['StorageType'] = e.value;
   this.props.sizerWorkLoad.UserInputs.Environments['ProductionEnvironment'] = Obj;
   this.state.ProdEnv = Obj;
  //  var MaxDBSize = this.LoadDBSize( Obj['DataBaseSize'], 
  //                                   Obj['GrowthYears'], 
  //                                   Obj['YearlyGrowth']);   
  //  this.updateProcList(MaxDBSize);   
   this.setState({ ProdEnv: Obj, StorageValue: e.value});
 }

 PercentGrowth(Growth){
   var output = 0.0;
   switch (Growth)
   {
     case "10%": output = 0.1; break;
     case "20%": output = 0.2; break;
     case "30%": output = 0.3; break;
     case "40%": output = 0.4; break;
     case "50%": output = 0.5; break;
     case "60%": output = 0.6; break;
     case "70%": output = 0.7; break;
     case "80%": output = 0.8; break;
     case "90%": output = 0.9; break;
     case "100%": output = 1.0; break;
     default: output = 0.0; break;
   }
   return output;
 }
 
 LoadDBSize(DBSize, yearsGrowth, Growthpercent){
   var FinalDB = 0.0;
   var Db = parseInt(DBSize, 10); 
   var saprecmmd = 0.5;    // SAP recommended 50%
   var sapovr = 0.2;      //  SAP overhead 20%
   var dbsize = Db * saprecmmd;   // recommended DB  size
   var dbTotal = (dbsize * sapovr) + dbsize; // total DB size with overhead
   var grwth = this.PercentGrowth(Growthpercent); // growth % 
   var dbpercntGrowth = dbTotal * grwth;  // percentage of DB growth
   var initialDB = Math.ceil(dbTotal + dbpercntGrowth);
   if (parseInt(yearsGrowth, 10) > 1){
      for(var i = 2; i <= parseInt(yearsGrowth, 10); i++)
      {
         var tempgrowth = initialDB * grwth;
         var temp = Math.ceil(initialDB + tempgrowth);
         initialDB = temp;
      }
   }
   FinalDB = initialDB;
   return FinalDB.toString();
 }

 updateServerList(DBSize){
    var ServersList = [];
    this.state.ProdEnv['MemorySize'] = DBSize;
    SupportedList.Server.filter( (item, index) => {
      if(DBSize <= parseFloat(item['@MaxMemory'], 10) ){
         ServersList.push( item['@Name'] );
      }
    });

    if (ServersList.length < 1){
        ServersList.push("No Servers found");
    }
    if (this.state.ServerPlatformList.length !== ServersList.length || ServersList.indexOf(this.state.ServerPlatform) === -1 ){
        this.state.ServerPlatformList = ServersList;
    }
    if (ServersList.indexOf(this.state.ServerPlatform) === -1 ){
        this.state.ServerPlatform = ServersList[0];
    }
    this.updateProcList(this.state.ServerPlatform);
 }

 updateProcList(strServer){
    try
    {
        var Obj = this.state.ProdEnv;
        var MaxDBSize = this.LoadDBSize( Obj['DataBaseSize'], 
                                         Obj['GrowthYears'], 
                                         Obj['YearlyGrowth'] );  
        MaxDBSize = parseInt(MaxDBSize, 10);        

        if (strServer === "HPE ProLiant DL580 Gen9"){
            var errorObj = { isError: false, errorMsg: ''};
            if(this.props.GlobalError.isError){
              this.props.updateError(errorObj);
            }
            if( MaxDBSize > 4096 ){
                this.state.ProcList = ["No Processors found"];
                this.state.ProdEnv['ProcessorSelected'] = 'No Processors found';
                var errorObj = { isError: true, errorMsg: 'The Required HANA Memory size for these inputs is currently too large.' + "\n" + 'Kindly contact our HPE representative for further advice.'};
                if(!this.props.GlobalError.isError){
                  this.props.updateError(errorObj);
                }
            }else if (MaxDBSize > 1536 && MaxDBSize <= 2048){
                this.state.ProcList = ["E7-8890v4"];
            }else if (MaxDBSize > 3072 && MaxDBSize <= 4096){
                this.state.ProcList = ["E7-8890v4"];
            }else{
                this.state.ProcList = ["E7-8890v4", "E7-8880v4"];
            }            
            if( this.state.ProcList.indexOf(this.state.ProdEnv['ProcessorSelected']) === -1 ){
                this.state.ProdEnv['ProcessorSelected'] = this.state.ProcList[0];
            }
            this.updateProcQtyList(strServer, MaxDBSize);
        }else if (strServer === "HPE ProLiant DL560 Gen10"){
            var errorObj = { isError: false, errorMsg: ''};
            if(this.props.GlobalError.isError){
              this.props.updateError(errorObj);
            }
            if (MaxDBSize > 6144){
                this.state.ProcList = ["No Processors found"];
                this.state.ProdEnv['ProcessorSelected'] = 'No Processors found';
                var errorObj = { isError: true, errorMsg: 'The Required HANA Memory size for these inputs is currently too large.' + "\n" + 'Kindly contact our HPE representative for further advice.'};
                if(!this.props.GlobalError.isError){
                  this.props.updateError(errorObj);
                }
            }else if (MaxDBSize > 3072) {
                this.state.ProcList = ["8180M"];
            }else if (MaxDBSize > 1536){
                this.state.ProcList = ["8176", "8180", "8180M"];
            }else{
                this.state.ProcList = ["8176", "8180"];
            }
            if( this.state.ProcList.indexOf(this.state.ProdEnv['ProcessorSelected']) === -1 ){
                this.state.ProdEnv['ProcessorSelected'] = this.state.ProcList[0];
            }
            this.updateProcQtyList(strServer, MaxDBSize);
        }else if (strServer === "No Servers found"){
            this.state.ProcList = ["No Processors found"];
            this.state.ProdEnv['ProcessorSelected'] = 'No Processors found';
            var errorObj = { isError: true, errorMsg: 'The Required HANA Memory size for these inputs is currently too large.' + "\n" + 'Kindly contact our HPE representative for further advice.'};
            if(!this.props.GlobalError.isError){
               this.props.updateError(errorObj);
            }
        }else{ }
    }
    catch (e) {
        console.log(e);
    }
 }

 updateProcQtyList(value, DBSize){
    
    // Skylake Changes
    if (value === "HPE ProLiant DL580 Gen9"){
        if (DBSize <= 128){
            this.state.ProcQtyList = ['2'];
        }else if (DBSize > 128 && DBSize <= 2048){
            this.state.ProcQtyList = ['2','4'];
        }else if (DBSize > 2048 && DBSize <= 4096){
            this.state.ProcQtyList = ['4'];
        }
        this.state.ProdEnv['ProcessorQty'] = this.state.ProcQtyList[0];
    }else if (value === "HPE ProLiant DL560 Gen10"){
        if (this.state.ProdEnv['ProcessorSelected'].indexOf("M") > 0){
            if (DBSize <= 3072){
                this.state.ProcQtyList = ['2'];
            }else{
                this.state.ProcQtyList = ['4'];
            }
        }else{
            if (DBSize <= 1536){
                this.state.ProcQtyList = ['2', '4'];
            }else{
                this.state.ProcQtyList = ['4'];
            }
        }
    }else { }
    
    if( this.state.ProcQtyList.indexOf(this.state.ProdEnv['ProcessorQty']) === -1 ){
        this.state.ProdEnv['ProcessorQty'] = this.state.ProcQtyList[0];
    }
    this.updateMemoryCalc(DBSize);
    //this.CalculateMemoryOptions();
 }

 updateMemoryCalc(DBSize){

    // Memory Range
    // 128GB, 256GB, 384GB, 512GB, 768GB, 1024GB, 1536GB, 2048GB, 3072GB and 4072GB    
    DBSize = parseInt(DBSize, 10);
    lstMemoryDetails = {};
    var ServObj = {};
    var selProcQty = this.state.ProdEnv['ProcessorQty'];          
    SupportedList.Server.filter( (item, index) => {
      if(item['@Name'] === this.state.ServerPlatform ){
         ServObj = item;
      }
    });
    var ProcItem = ServObj.MemoryOptions.find(function (elem){
       if( elem['@ProcQty'] === selProcQty){
         return elem;
       }
    });    
    this.state.MemoryList = [];
    var check = true;
    ProcItem.Memory.map( (memItem, index) => {
            if ( DBSize <= parseInt(memItem["@Size"], 10) && check ){
                if(memItem['@isCombined'] === null || memItem['@isCombined'] === undefined ){
                  if(Array.isArray(memItem.Item)){
                      memItem.Item.map( (item, index) => {                             
                          // if(Object.Keys(lstMemoryDetails).indexOf( item["@DIMMSize"] + " GB") === -1 ){
                          //   lstMemoryDetails[item["@DIMMSize"] + " GB"] = item["@Qty"];
                          // }
                          this.state.MemoryList.push( item["@DIMMSize"] + " GB" ); 
                      });
                  }else{
                      // if(Object.Keys(lstMemoryDetails).indexOf( memItem.Item["@DIMMSize"] + " GB") === -1 ){
                      //   lstMemoryDetails[ memItem.Item["@DIMMSize"] + " GB"] = memItem.Item["@Qty"];
                      // }
                      this.state.MemoryList.push( memItem.Item["@DIMMSize"] + " GB" );
                  }
                }else{
                  var strMemDIMM = '';
                  memItem.Item.map( (item, index) => {
                      strMemDIMM = (strMemDIMM === '' || strMemDIMM === null || strMemDIMM === undefined) ? 
                                    item["@DIMMSize"] + " GB" : 
                                    strMemDIMM + " & " + item["@DIMMSize"] + " GB";
                      // if(Object.Keys(lstMemoryDetails).indexOf( strMemDIMM ) === -1 ){
                      //   lstMemoryDetails[ strMemDIMM ] = item["@Qty"];
                      // }
                  });
                  this.state.MemoryList.push( strMemDIMM );
                } 
                check = false;
            }    
    });
        
    // if( this.state.MemoryList.indexOf(this.state.ProdEnv['MemorySelected']) === -1 ){
    //     this.state.ProdEnv['MemorySelected'] = this.state.MemoryList[0];
    // }         
    this.state.ProdEnv['MemorySelected'] = this.state.MemoryList[0];
    // this.updateMemoryQty(this.state.ProdEnv['MemorySelected']);                     
    this.updateStorageList(DBSize, this.state.ProdEnv['ProcessorSelected'], selProcQty);
 }

 updateMemoryQty(strMemSelected){
    var strMemoryQty = '';
    try{
        if ( Object.Keys(lstMemoryDetails).length > 0){
            try{
                 strMemoryQty = lstMemoryDetails[strMemSelected];
            }catch(e) 
            { console.log(e); }
        }
    }catch(e) 
    { console.log(e); }
    this.state.ProdEnv['MemoryQty'] = strMemoryQty;
 }

 updateStorageList(DBSize, strProc, strProcQty){

    if (this.state.ServerPlatform === "HPE ProLiant DL580 Gen9"){
        this.state.StorageList = ['HPE SAP HANA Scale-up Storage'];
    }else if (this.state.ServerPlatform === "HPE ProLiant DL560 Gen10"){

            if (DBSize <= 768){
                this.state.StorageList = ['Regular', 'Large'];
                // rdRegular.IsEnabled = rdLarge.IsEnabled = true;
                // rdRegular.IsChecked = true;
                // rdExtraLarge.IsEnabled = false;
            }else if (DBSize > 768 && DBSize <= 3072){
                this.state.StorageList = ['Large'];
                // rdRegular.IsEnabled = false;
                // rdLarge.IsEnabled = true;
                // rdLarge.IsChecked = true;
                // rdExtraLarge.IsEnabled = false;
                // rdExtraLarge.IsChecked = false;

                if (strProc.indexOf("M") > 0 && strProcQty === "2" && (DBSize > 1536 && DBSize <= 3072)){
                    this.state.StorageList = ['Extra Large'];
                    // rdRegular.IsEnabled = false;
                    // rdLarge.IsEnabled = false;
                    // rdExtraLarge.IsEnabled = true;
                    // rdExtraLarge.IsChecked = true;
                }
                if (strProc.indexOf("M") > 0 && strProcQty === "4" && (DBSize > 1536 && DBSize <= 3072)){
                    this.state.StorageList = ['Large'];
                    // rdRegular.IsEnabled = false;
                    // rdLarge.IsEnabled = true;
                    // rdLarge.IsChecked = true;
                    // rdExtraLarge.IsEnabled = false;
                }

            }else if (DBSize > 3072){// && strProcQty.Equals("4"))
                this.state.StorageList = ['Extra Large'];
                // rdRegular.IsEnabled = false;
                // rdLarge.IsEnabled = false;
                // rdExtraLarge.IsEnabled = true;
                // rdExtraLarge.IsChecked = true;
            }

            // if(this.state.StorageList.indexOf( this.state.StorageValue ) === -1 ){
            //   this.state.StorageValue = this.state.StorageList[0];
            // }
    }else{}
    
    // this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment.Storage.StorageType = this.state.StorageList[0];
    this.state.ProdEnv['Storage']['StorageType'] = this.state.StorageList[0];
    this.props.sizerWorkLoad.UserInputs.Environments['ProductionEnvironment'] = this.state.ProdEnv;
    this.setState({StorageValue: this.state.StorageList[0]});      
 }

 render() {
    
    var inputLabelStyle={    
        // width: '35%',
        float: 'right',
        // padding: '16px 0px',
        marginBottom: '0px',
        fontSize: '.875rem',
        lineHeight: '21px',
        marginTop: '0px',
        color: '#666'  // color: '#fff'
    }
    
    var ProcQtyContent = '';

    if(this.props.sizerWorkLoad !== ''){
      // var MaxDBSize = this.LoadDBSize(this.state.ProdEnv['DataBaseSize'], this.state.ProdEnv['GrowthYears'], this.state.ProdEnv['YearlyGrowth']);      
      // this.updateProcList(MaxDBSize);

      if(this.state.ProdEnv['ProcessorSelected'] === 'No Processors found'){
          ProcQtyContent = '';
       }else{
          ProcQtyContent = <Form style={{maxWidth: '300px' }} >
                                     <FormField className="CustomInputFormField" label='Processor Quantity'>
                                          <Select onChange={this.onProcQtyChange.bind(this) } 
                                                  options={this.state.ProcQtyList}
                                                  value={ this.state.ProdEnv['ProcessorQty'] } />
                                     </FormField> 
                           </Form>
      }
    }

  //  var toast = '';
  //  if(this.state.ToastVisible){
  //    toast = <Toast status='critical'
  //                     onClose={ () => { this.setState({ToastVisible: false}) } } >
  //                     The Required HANA Memory size for these inputs is currently too large.
  //                     Kindly contact our HPE representative for further advice.
  //            </Toast>
  //   }else{
  //    toast = '';
  //  }

  //  { toast }

    return (
      <Box pad='small' margin='none' style={{position:'relative', width: '100%'}}>           
         {/*     <Box margin="none" pad="none" separator="bottom" style={{width: '100%',paddingBottom:'5px', height: '50px'}}>
                <Title>Build your own solutions - 2 of 3</Title>
           </Box>  */}
           <Article full={true} margin="none" pad={{between: 'medium'}} style={{ maxHeight: '95%' }} > 
              <Box direction='row' margin='none' pad={{between: 'medium'}} >    
                <Box id='Database Size' margin='none' pad="none" separator="none" > 
                     <Heading tag='h5' strong={true} margin='small' style={{ marginTop: '0%' }}>Database Size</Heading>     
                     <Box margin="none" pad={{ between: 'small' }} separator="none" style={{padding: '0px' }} >                    
                          <Form style={{maxWidth: '300px' }} >
                                <FormField className="CustomInputFormField" label='Uncompressed Database-Size'
                                    error={<Label style={inputLabelStyle}>GB</Label>} > 
                                    <TextInput id='DataBaseSize'
                                               value={ this.state.ProdEnv['DataBaseSize'] }
                                               onBlur={this.onDBSizeValidate.bind(this)}
                                               onDOMChange={this.onDataBaseSizeChange.bind(this)} />
                                </FormField> 
                          </Form> 
                     </Box>
                </Box> 
                <Box id='Yearly Growth' margin='none' pad="none" separator="none" > 
                     <Heading tag='h5' strong={true} margin='small' style={{ marginTop: '0%' }}>Yearly Growth</Heading>  
                     <Box direction='row' margin="none" pad={{ between: 'medium' }} separator="none" style={{padding: '0px' }} > 
                          <Form style={{maxWidth: '300px' }} >
                                <FormField className="CustomInputFormField" label='Number of Years'>
                                     <Select onChange={this.onGrowthYearsChange.bind(this) } 
                                             options={this.state.GrowthYearsList}
                                             value={ this.state.ProdEnv['GrowthYears'] } />
                                </FormField> 
                          </Form>                                  
                          <Form style={{maxWidth: '300px' }} >
                                <FormField className="CustomInputFormField" label='Percentage of Growth'>
                                     <Select onChange={this.onYearlyGrowthPercChange.bind(this) } 
                                             options={this.state.YearlyGrowthPercList}
                                             value={ this.state.ProdEnv['YearlyGrowth'] } />
                                </FormField> 
                          </Form>                              
                     </Box>      
                </Box> 
              </Box>
              <Box direction='row' margin='none' pad={{between: 'medium'}} >    
                <Box id='Server Platform' margin='none' pad="none" separator="none" > 
                     <Heading tag='h5' strong={true} margin='small' style={{ marginTop: '0%' }}>Server Choice</Heading>     
                     <Box margin="none" pad={{ between: 'small' }} separator="none" style={{padding: '0px' }} >                    
                          <Form style={{maxWidth: '300px' }} >
                                <FormField className="CustomInputFormField" label='Server Platform'>
                                     <Select onChange={this.onServerPlatformChange.bind(this) } 
                                             options={ this.state.ServerPlatformList }
                                             value={ this.state.ServerPlatform } />
                                </FormField> 
                          </Form> 
                     </Box>
                </Box> 
                <Box id='Processor Choice' margin='none' pad="none" separator="none" > 
                     <Heading tag='h5' strong={true} margin='small' style={{ marginTop: '0%' }}>Processor Choice</Heading>  
                     <Box direction='row' margin="none" pad={{ between: 'medium' }} separator="none" style={{padding: '0px' }} > 
                          <Form style={{maxWidth: '300px' }} >
                                <FormField className="CustomInputFormField" label='Processor List'>
                                          <Select onChange={this.onProcItemChange.bind(this) } 
                                                  options={this.state.ProcList}
                                                  value={ this.state.ProdEnv['ProcessorSelected'] } />
                                </FormField> 
                          </Form>   
                          { ProcQtyContent }                           
                     </Box>      
                </Box> 
              </Box> 
              {this.state.ProdEnv['ProcessorSelected'] !== 'No Processors found' ?   
              <Box direction='row' margin='none' pad={{between: 'medium'}} >                                        
                  <Box id='Memory Choice' margin='none' pad="none" separator="none" >
                      <Heading tag='h5' strong={true} margin='small'>Memory Choice</Heading>   
                      <Form style={{maxWidth: '300px' }} >
                            <FormField className="CustomInputFormField" label='Memory List'>
                                        <Select onChange={this.onMemoryItemChange.bind(this) } 
                                                options={this.state.MemoryList}
                                                value={ this.state.ProdEnv['MemorySelected'] } />
                            </FormField> 
                        </Form> 
                      {/* <Animate visible={this.state.Enable32GB && this.state.Enable64GB} enter={{"animation": "slide-left", "duration": 200, "delay": 0}} 
                            keep={false} style={{width:'100%'}} >*/}
                          {
                          this.state.Enable32GB && this.state.Enable64GB ?
                          <Box direction='row' margin='none' pad={{between: 'small'}} > 
                                <Heading tag='h4' strong={true} margin='small' style={{color:'#01a982'}} > Note: </Heading>
                                <Heading tag='h4' strong={false} margin='small' style={{color:'#ff9374',fontSize:'16px',fontWeight:'500'}} >
                                        Your Configuration allows the selection of two different memory module types, please choose the preferred option. 
                                </Heading>
                          </Box>:''
                          
                          }
                      {/*  </Animate>*/}
                  </Box>                              
                  <Box id='Storage System' margin='none' pad="none" separator="none" >
                      <Heading tag='h5' strong={true} margin='small'>Storage Configuration</Heading>    
                      <Form style={{maxWidth: '300px' }} >
                            <FormField className="CustomInputFormField" label='Storage System'>
                                        <Select onChange={this.onStrgItemChange.bind(this) } 
                                                options={ this.state.StorageList }
                                                value={ this.state.ProdEnv['Storage']['StorageType'] } />
                            </FormField>
                      </Form>                                  
                  </Box>
              </Box> 
              : null }                 
           </Article>           
      </Box>
    ); 
 }

}

const mapStateToProps = (state) => {  
  return{     
      activeSession: state.sessions.activeSession,
      GlobalError: state.sessions.activeSession.globalError,
      DefaultInputs: state.sizerWorkload.sessionDefaults.Sizers.Sizer,
      sizerWorkLoad: state.sizerWorkload.workload
  }
};
 
const mapDispatchToProps = (dispatch) => {
    return {
      updateError:(errorMsg) =>{
          dispatch(errorValidataion(errorMsg));
        },
      OntoggleSizeButton:(value)=>{
        dispatch(toggleSizeButton(value));
      }
    };
  
};

export default connect(mapStateToProps,mapDispatchToProps)(EnvironmentDetails);
