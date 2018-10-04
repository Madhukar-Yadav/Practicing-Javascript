import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Prompt } from 'react-router-dom';
import {errorValidataion,toggleSizeButton} from '../../State/actions/sessions';
import Toast from 'grommet/components/Toast';
import Title from 'grommet/components/Title';
import Box from 'grommet/components/Box';
import Article from 'grommet/components/Article';
import Heading from 'grommet/components/Heading';
import CheckBox from 'grommet/components/CheckBox';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Paragraph from 'grommet/components/Paragraph';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import Button from 'grommet/components/Button';
import Form from 'grommet/components/Form';
import Select from 'grommet/components/Select';
import Animate from 'grommet/components/Animate';
import Label from 'grommet/components/Label';
import NumberInput from 'grommet/components/NumberInput';
import FormClose from 'grommet/components/icons/base/FormClose';
import InfoIcon from 'grommet/components/icons/base/CircleInformation';

var DefaultOracleProfileData = {
                            "Region": "Americas",
                            "CustomerCompany": '',
                            "City": '',
                            "State": '',
                            "Country": '',
                            "MailId": "Oracle-RAM.EMEA@hp.com",
                            "Contact": '',
                            "Opportunity": '',
                            "Name": '',
                            "RequestorName": '',
                            "RequestorTitle": '',
                            "RequestorCompany": '',
                            "RequestorPhone": '',
                            "RequestorEmail": '',
                            "Role": '',
                            "CompetitorName": '',
                            "HPContact": '',
                            "Competitor": '',
                            "Comments": '',
                            "IsExternalUser": "False"
}

class ContactInfo extends Component {

  constructor(props){
      super(props);
      this.state = {  
                     ShowPopup:false,                      
                     RegionsList: [], RolesList: [], StatesList: [], EmailErrorMsg: '',
                     OracleProfileData: Object.assign({},DefaultOracleProfileData)
                   };      
  }

  componentWillMount(){       
      this.props.DefaultInputs.ContactInfo.ComboFields.ComboField.map( (item, index) => {
          switch(item["@name"]){
              case "cboRegion": {
                   this.state.RegionsList = item['DisplayMembers']['DisplayMember'];
                   break;
              }
              case "cboRole": {
                   this.state.RolesList = item['DisplayMembers']['DisplayMember'];
                   break;
              }
              case "cboStates": {
                   this.state.StatesList = item['DisplayMembers']['DisplayMember'];
                   break;
              }
              default: break;
          }
      });
     // OracleProfileData in <ProductionEnvironment /> 
     if(this.props.sizerWorkLoad !== ''){    
        
        // new addition  
        // this.props.activeSession.isSizeEnabled = false;      
        if(this.props.activeSession.isSizeEnabled){
           this.props.OntoggleSizeButton(false);
        }

        if(this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['OracleProfileData'] === undefined){
            this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['Country'] = "United States";
            this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['AdditionalParameters'] = '';
            this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['SystemCopy'] = '';
            this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['OracleProfileData'] = this.state.OracleProfileData;         
        }else{
            this.state.OracleProfileData = this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['OracleProfileData'];      

            // Check for EmailID Validation
            var reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if( this.state.OracleProfileData['RequestorEmail'] === '' || 
                reg.test( this.state.OracleProfileData['RequestorEmail'] ) ){
                this.state.EmailErrorMsg = '';
            }else{
                this.state.EmailErrorMsg = 'Email ID Invalid';
            }

        }

       // Production Environment Details in <ProductionEnvironment /> 
        this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['ProdHanaSelected'] = 
        'HPE ConvergedSystem 500 for SAP HANA Compute Node';
            if(this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['ProcessorSelected'] === undefined){
            this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['ProcessorSelected'] = "";
            this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['ProcessorQty'] = '2';      
            this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['MemorySelected'] = '32 GB memory';
            this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['MemoryQty'] = '4';          
            }

       // Other Environment Details in <OtherEnvironment />   
        // TestQA Section            
            if(this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['TestQA']['TestCSHana'] === undefined){
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['TestQA']['TestCSHana'] = 'HPE ConvergedSystem 500 for SAP HANA Compute Node';
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['TestQA']['TestHana'] = 'HPE ConvergedSystem 500 for SAP HANA Compute Node';
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['TestQA']['TestQADBSize'] = '1';
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['TestQA']['TestProcessorQty'] = '2';
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['TestQA']['TestProcessor'] = '';
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['TestQA']['TestMemory'] = '';
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['TestQA']['TestMemoryQty'] = '4';
            }
        // Development Section
            if(this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['Dev']['DevCSHana'] === undefined){
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['Dev']['DevCSHana'] = 'HPE ConvergedSystem 500 for SAP HANA Compute Node';
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['Dev']['DevHana'] = 'HPE ConvergedSystem 500 for SAP HANA Compute Node';                
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['Dev']['DevDBSize'] = '1';  
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['Dev']['DevProcessorQty'] = '2';
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['Dev']['DevProcessor'] = '';
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['Dev']['DevMemory'] = '';
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['Dev']['DevMemoryQty'] = '4';          
            }
        // SandBox Section            
            if(this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['SandBox']['SandBoxCSHana'] === undefined){
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['SandBox']['SandBoxCSHana'] = 'HPE ConvergedSystem 500 for SAP HANA Compute Node';
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['SandBox']['SandBoxHana'] = 'HPE ConvergedSystem 500 for SAP HANA Compute Node';                
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['SandBox']['SandBoxDBSize'] = '1';
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['SandBox']['SandBoxProcessorQty'] = '2';
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['SandBox']['SandBoxProcessor'] = '';
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['SandBox']['SandBoxMemory'] = '';
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['SandBox']['SandBoxMemoryQty'] = '4';
            }
       // Combined System Section
         // this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["CombinedDB"]["CombinedHANA"] = "HPE ConvergedSystem 500 for SAP HANA Compute Node";
          if(this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["CombinedDB"]["CombinedCSHANA"] == undefined){
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["CombinedDB"]["CombinedCSHANA"]='HPE ConvergedSystem 500 for SAP HANA Compute Node'                           
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["CombinedDB"]["DevProcessor"]='';  
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["CombinedDB"]["DevMemory"]='';  
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["CombinedDB"]["DevMemoryQty"]='8';
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["CombinedDB"]["DevProcessorQty"]='2';                           
          }    
        
       // Error Validation Checks
        // var reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        // var emailID = this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment.OracleProfileData['RequestorEmail'];
        
        //    if( emailID === '' || reg.test(emailID) ){
        //        if(this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['ProcessorSelected'] !== "Select Processor"){
        //             if(this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['TestQA']['@dedicated'] === 'True' ||
        //                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['Dev']['@dedicated'] === 'True' ||
        //                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['SandBox']['@dedicated'] === 'True' ){

        //             }else{

        //             }
        //             if( !this.props.activeSession.isSizeEnabled ){
        //                 var errorObj = { isError: true, errorMsg: 'Please select the processor from the dropdown.'};
        //                 this.props.updateError(errorObj);
        //                 this.props.OntoggleSizeButton(false);
        //             }

        //        }else{
        //            if( !this.props.activeSession.isSizeEnabled ){
        //                 var errorObj = { isError: true, errorMsg: 'Please select the processor from the dropdown.'};
        //                 this.props.updateError(errorObj);
        //                 this.props.OntoggleSizeButton(false);
        //            }
        //        }        
        //    }else{
        //           if( !this.props.activeSession.isSizeEnabled ){
        //                 var errorObj = { isError: true, errorMsg: 'Please provide a valid EmailID.'};
        //                 this.props.updateError(errorObj);
        //                 this.props.OntoggleSizeButton(false);
        //           }
        //    }
     }
  }



  componentWillReceiveProps(nextprops, nextstate){   
    //   console.log("Will receive"); 
    //   console.log(this.props.activeSession);        
    //   console.log(nextprops.activeSession);  
      //if(this.props.activeSession.id !== )
      nextprops.DefaultInputs.ContactInfo.ComboFields.ComboField.map( (item, index) => {
          switch(item["@name"]){
              case "cboRegion": {
                   this.state.RegionsList = item['DisplayMembers'];
                   break;
              }
              case "cboRole": {
                   this.state.RolesList = item['DisplayMembers'];
                   break;
              }
              case "cboStates": {
                   this.state.StatesList = item['DisplayMembers'];
                   break;
              }
              default: break;
          }
      });
      if(nextprops.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['OracleProfileData'] === undefined){
          nextprops.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['Country'] = "United States";
          nextprops.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['AdditionalParameters'] = '';
          nextprops.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['SystemCopy'] = '';
          nextprops.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['OracleProfileData'] = Object.assign({},DefaultOracleProfileData);      
          this.setState({ OracleProfileData: Object.assign({},DefaultOracleProfileData)});
      }else{
          this.setState({ OracleProfileData: nextprops.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['OracleProfileData']});
      }
  }
  
 // Customer Information Methods
  onRegionChange(e){ 
      var Obj = this.state.OracleProfileData;
      Obj['Region'] = e.value;
      this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['OracleProfileData'] = Obj;
      this.setState({ OracleProfileData: Obj });
  }
  onCompanyChange(e){
      var Obj = this.state.OracleProfileData;
      Obj['CustomerCompany'] = e.target.value;
      this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['OracleProfileData'] = Obj;
      this.setState({ OracleProfileData: Obj });
  }
  onCityChange(e){
      var Obj = this.state.OracleProfileData;
      Obj['City'] = e.target.value;
      this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['OracleProfileData'] = Obj;
      this.setState({ OracleProfileData: Obj });
  }
  onStateChange(e){
      var Obj = this.state.OracleProfileData;
      Obj['State'] = e.value;
      this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['OracleProfileData'] = Obj;
      this.setState({ OracleProfileData: Obj });
  } 
  onCountryChange(e){
      var Obj = this.state.OracleProfileData;
      Obj['Country'] = e.target.value;
      this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['OracleProfileData'] = Obj;
      this.setState({ OracleProfileData: Obj });
  }
  onContactChange(e){
      var Obj = this.state.OracleProfileData;
      Obj['Contact'] = e.target.value;
      this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['OracleProfileData'] = Obj;
      this.setState({ OracleProfileData: Obj });
  }
  onOpportunityChange(e){
      var Obj = this.state.OracleProfileData;
      Obj['Opportunity'] = e.target.value;
      this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['OracleProfileData'] = Obj;
      this.setState({ OracleProfileData: Obj });
  }

 //Requestor Information Methods
  onRequestorNameChange(e){
      var Obj = this.state.OracleProfileData;
      Obj['Name'] = e.target.value;
      this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['OracleProfileData'] = Obj;
      this.setState({ OracleProfileData: Obj });
  }   
  onTitleChange(e){
      var Obj = this.state.OracleProfileData;
      Obj['RequestorTitle'] = e.target.value;
      this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['OracleProfileData'] = Obj;
      this.setState({ OracleProfileData: Obj });
  }   
  onCompanyNameChange(e){
      var Obj = this.state.OracleProfileData;
      Obj['RequestorCompany'] = Obj['RequestorName'] = e.target.value;
      this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['OracleProfileData'] = Obj;
      this.setState({ OracleProfileData: Obj });
  }   
  onPhoneChange(e){
      var Obj = this.state.OracleProfileData; 
      var reg =/^\d+$/;  
      if( e.target.value === "" || reg.test(e.target.value) ){
          if(e.target.value.length < 21){
             Obj['RequestorPhone'] = e.target.value;
             this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['OracleProfileData'] = Obj;
             this.setState({ OracleProfileData: Obj });
          }
      }else{
          Obj['RequestorPhone'] = this.state.OracleProfileData['RequestorPhone'];
          this.setState({ OracleProfileData: Obj });
      }
  }   
  onEmailChange(e){
      var Obj = this.state.OracleProfileData;            
      Obj['RequestorEmail'] = e.target.value;
      this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['OracleProfileData'] = Obj;
      // var reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      // var reg = /^[a-zA-Z0-9.!#$%&’*+=?^_`{|}~-]+@[a-zA-Z0-9]+(?:\.[a-zA-Z]{2,})*$/;
      var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if( Obj['RequestorEmail'] === '' || reg.test( Obj['RequestorEmail'] ) ){
        this.setState({ OracleProfileData: Obj, EmailErrorMsg: ''});
      }else{          
        this.setState({ OracleProfileData: Obj, EmailErrorMsg: 'Email ID Invalid'});
      }
  }   
  onEmailValidate(){
      var Obj = this.state.OracleProfileData;
      // var reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      // var reg = /^[a-zA-Z0-9.!#$%&’*+=?^_`{|}~-]+@[a-zA-Z0-9]+(?:\.[a-zA-Z]{2,})*$/;
      var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      
      if( Obj['RequestorEmail'] === '' || reg.test( Obj['RequestorEmail'] ) ){
              console.log("valid")          
                 
              var errorObj = { isError: false, errorMsg: '' };
              this.props.updateError(errorObj);
              this.state.EmailErrorMsg = '';
              // But still need to check for Further errors

              // Not required here after
            //   if(this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['ProcessorSelected'] === 'Select Processor'){
                  
            //       this.props.OntoggleSizeButton(false);

            //   }else if( (this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['TestQA']['@dedicated'] === 'True' &&
            //              this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['TestQA']['TestProcessor'] == 'Select Processor') ||
            //              (this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['Dev']['@dedicated'] === 'True' &&
            //              this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['Dev']['DevProcessor'] == 'Select Processor') ||
            //              (this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['SandBox']['@dedicated'] === 'True' &&
            //              this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['SandBox']['SandBoxProcessor'] == 'Select Processor') ) {
                  
            //       this.props.OntoggleSizeButton(false);

            //   }else{
            //       this.props.OntoggleSizeButton(true);
            //   }              
       }else{
              console.log("Notvalid")              
              this.state.EmailErrorMsg = 'Email ID Invalid';    
              var errorObj = { isError:true, errorMsg:' Please enter a valid Email ID.'};
              this.props.updateError(errorObj);
            //   this.props.OntoggleSizeButton(false);
      }               
  } 
  onRoleChange(e){
      var Obj = this.state.OracleProfileData;
      Obj['Role'] = e.value;
      this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['OracleProfileData'] = Obj;
      this.setState({ OracleProfileData: Obj });
  }
    
 // HPE Contact Information 
  onPrimaryHPEContactChange(e){
      var Obj = this.state.OracleProfileData;
      Obj['HPContact'] = e.target.value;
      this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['OracleProfileData'] = Obj;
      this.setState({ OracleProfileData: Obj });
  }   
  onHardwareCompetitorChange(e){
      var Obj = this.state.OracleProfileData;
      Obj['Competitor'] = e.target.value;
      this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['OracleProfileData'] = Obj;
      this.setState({ OracleProfileData: Obj });
  }     
  onCommentsChange(e){
      var Obj = this.state.OracleProfileData;
      Obj['Comments'] = e.target.value;
      this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['OracleProfileData'] = Obj;
      this.setState({ OracleProfileData: Obj });
  } 

 render() {
  
    // var DefaultInputs = this.props.DefaultInputs;  
    var Sections = {
        width:'100%'
    }
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
    
    // console.log('render');
    
    return (        
        
      <Box pad='small' margin='none' style={{position:'relative', width: '100%'}}>           
      {/*     <Box margin="none" pad="none" separator="bottom" style={{width:'100%', paddingBottom:'5px', height: '50px'}} >
                <Title>Build your own solutions - 1 of 3</Title>
           </Box>  */}
          
         {this.state.ShowPopup ? <Toast status='critical'> You are Entered valid Email id</Toast> :null}
           <Article full={true} margin="none" pad={{between: 'small'}} style ={{ maxHeight: '95%' }} justify='between' > 
              <Box direction='row' margin="none" pad={{between: 'medium'}} >    
                <Box id='Customer Information' margin='none' pad="none" separator="none" > 
                     <Heading tag='h5' strong={true} margin='small' style={{ marginTop: '0%' }}>Customer Information</Heading>                                                        
                     <Box margin="none" pad="small"  separator="all" >                     
                          <Form style={{maxWidth: '300px' }} >
                                <Box margin='none' pad={{between: 'small'}} >
                                     <FormField className="CustomInputFormField" label='Region'>
                                        <Select onChange={this.onRegionChange.bind(this) } 
                                                options={this.state.RegionsList}
                                                value={ this.state.OracleProfileData['Region'] } />
                                     </FormField>
                                     <FormField className="CustomInputFormField" label='Company'>
                                        <TextInput id='Company'
                                                   value={ this.state.OracleProfileData['CustomerCompany'] }
                                                   onDOMChange={this.onCompanyChange.bind(this)} />
                                     </FormField> 
                                     <FormField className="CustomInputFormField" label='City'>
                                        <TextInput id='City'
                                                   value={ this.state.OracleProfileData['City'] }
                                                   onDOMChange={this.onCityChange.bind(this)} />
                                     </FormField> 
                                     <FormField className="CustomInputFormField" label='State'>
                                        <Select onChange={this.onStateChange.bind(this) } 
                                                options={this.state.StatesList}
                                                value={ this.state.OracleProfileData['State'] } />
                                     </FormField> 
                                     <FormField className="CustomInputFormField" label='Country'>
                                       <TextInput id='Country'
                                                  value={ this.state.OracleProfileData['Country'] }
                                                  onDOMChange={this.onCountryChange.bind(this)} />
                                     </FormField> 
                                     <FormField className="CustomInputFormField" label='Contact'>
                                       <TextInput id='Contact'
                                                  value={ this.state.OracleProfileData['Contact'] }
                                                  onDOMChange={this.onContactChange.bind(this)} />
                                     </FormField> 
                                     <FormField className="CustomInputFormField" label='Opportunity/Siebel ID'>
                                       <TextInput id='Opportunity/SiebelID'
                                                  value={ this.state.OracleProfileData['Opportunity'] }
                                                  onDOMChange={this.onOpportunityChange.bind(this)} />
                                     </FormField>                            
                                </Box> 
                          </Form>      
                     </Box>
                </Box>
                <Box id='Requestor Information' margin='none' pad="none" separator="none" > 
                     <Heading tag='h5' strong={true} margin='small' style={{ marginTop: '0%' }}>Requestor Information</Heading>                                                        
                     <Box margin="none" pad="small"  separator="all" >                     
                          <Form style={{maxWidth: '300px' }} >
                                <Box margin='none' pad={{between: 'small'}} >
                                     <FormField className="CustomInputFormField" label='Name'>
                                            <TextInput id='RequestorName'
                                                       value={this.state.OracleProfileData['Name']}
                                                       onDOMChange={this.onRequestorNameChange.bind(this)}  />
                                     </FormField> 
                                     <FormField className="CustomInputFormField" label='Title'>
                                            <TextInput id='RequestorTitle'
                                                       value={this.state.OracleProfileData['RequestorTitle']}
                                                       onDOMChange={this.onTitleChange.bind(this)}  />
                                     </FormField> 
                                     <FormField className="CustomInputFormField" label='Company Name'>
                                            <TextInput id='RequestorCompany'
                                                       value={this.state.OracleProfileData['RequestorCompany']}
                                                       onDOMChange={this.onCompanyNameChange.bind(this)}  />
                                     </FormField> 
                                     <FormField className="CustomInputFormField" label='Phone'
                                                >
                                            <TextInput id='RequestorPhone'
                                                       value={this.state.OracleProfileData['RequestorPhone']}
                                                       onDOMChange={this.onPhoneChange.bind(this)}  />
                                     </FormField> 
                                     <FormField className="CustomInputFormField" label='Email'
                                                error={this.state.EmailErrorMsg}  >
                                            <TextInput id='RequestorEmail'
                                                       value={this.state.OracleProfileData['RequestorEmail']}
                                                       onBlur={this.onEmailValidate.bind(this)} 
                                                       onDOMChange={this.onEmailChange.bind(this)} />
                                     </FormField> 
                                     <FormField className="CustomInputFormField" label='Role'>
                                            <Select onChange={ this.onRoleChange.bind(this) } 
                                                    options={this.state.RolesList}
						                            value={this.state.OracleProfileData['Role']} />
                                     </FormField>                            
                                </Box>
                          </Form>    
                     </Box>      
                </Box>
                <Box id='HPE Contact Information' margin='none' pad="none" separator="none" > 
                     <Heading tag='h5' strong={true} margin='small' style={{ marginTop: '0%' }}>HPE Contact Information</Heading>                                                        
                     <Box margin="none" pad="small"  separator="all" >                     
                          <Form style={{maxWidth: '300px' }} >
                                <Box margin='none' pad={{between: 'small'}} >
                                     <FormField className="CustomInputFormField" label='Primary HPE Contact'>
                                        <TextInput id='PrimaryHPEContact'
                                                   value={this.state.OracleProfileData['HPContact']}
                                                   onDOMChange={this.onPrimaryHPEContactChange.bind(this)} />
                                     </FormField>
                                     <FormField className="CustomInputFormField" label='Hardware Competitor'>
                                        <TextInput id='HardwareCompetitor'
                                                   value={this.state.OracleProfileData['Competitor']}
                                                   onDOMChange={this.onHardwareCompetitorChange.bind(this)} />
                                     </FormField> 
                                     <FormField className="CustomInputFormField" label='Comments'>
                                        <textarea id='Comments' name='Comments' value={this.state.OracleProfileData['Comments']}
                                                  placeholder='Please leave a comment here...' rows="5"
                                                  onChange={this.onCommentsChange.bind(this)} />
                                     </FormField>                      
                                </Box>
                          </Form>
                     </Box>
                </Box>
              </Box>
           </Article>

      </Box>
    );
  }
 }

 const mapStateToProps = (state) => {  
  return{
      DefaultInputs: state.sizerWorkload.sessionDefaults.Sizers.Sizer,
      activeSession: state.sessions.activeSession,
      GlobalErr: state.sessions.activeSession.globalError,
      sizerWorkLoad: state.sizerWorkload.workload
  }
 };

  const mapDispatchToProps = (dispatch) => {
    return {
    updateError:(errorMsg) =>{
        dispatch(errorValidataion(errorMsg));
      },
        OntoggleSizeButton:(value) =>{
            dispatch(toggleSizeButton(value));
      }
    };
 };

export default connect(mapStateToProps,mapDispatchToProps)(ContactInfo); 
