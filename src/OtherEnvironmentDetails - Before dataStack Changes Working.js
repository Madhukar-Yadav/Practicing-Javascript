import React, { Component } from 'react';
import { connect } from 'react-redux';
import {errorValidataion,toggleSizeButton} from '../../State/actions/sessions';
import Title from 'grommet/components/Title';
import Box from 'grommet/components/Box';
import Article from 'grommet/components/Article';
import Heading from 'grommet/components/Heading';
import CheckBox from 'grommet/components/CheckBox';
import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';
import Paragraph from 'grommet/components/Paragraph';
import FormField from 'grommet/components/FormField';
import RadioButton from 'grommet/components/RadioButton';
import TextInput from 'grommet/components/TextInput';
import Button from 'grommet/components/Button';
import Table from 'grommet/components/Table';
import TableRow from 'grommet/components/TableRow';
import Form from 'grommet/components/Form';
import Select from 'grommet/components/Select';
import Animate from 'grommet/components/Animate';
import Label from 'grommet/components/Label';
import NumberInput from 'grommet/components/NumberInput';
import FormClose from 'grommet/components/icons/base/FormClose';
import InfoIcon from 'grommet/components/icons/base/CircleInformation';

import SupportedList from '../../Datafiles/SupportedList.json';

let ProdDBSize = '1';
let ServerPlatform = "HPE ProLiant DL560 Gen10";
let ProcList = [];
let TestMemoryList = {};
let DevMemoryList = {};
let SBMemoryList = {};

class OtherEnvironmentDetails extends Component {
    constructor(props){
        super(props);
        this.state={
            TestObj: {}, DevObj: {}, SandBoxObj: {},

            TestEnable32GB: true, TestEnable64GB: true,
            DevEnable32GB: true, DevEnable64GB: true,
            SandBoxEnable32GB: true, SandBoxEnable64GB: true,

            TestMemory32GB: false, TestMemory64GB: false,
            DevMemory32GB: false, DevMemory64GB: false,
            SandBoxMemory32GB: false, SandBoxMemory64GB: false,

            TestProcList: [], TestQAProcQtyList: [], TestMemList: [], TestStrgList: [],
            DevProcList: [], DevProcQtyList: [], DevMemList: [], DevStrgList: [],
            SandBoxProcList: [], SandBoxProcQtyList: [], DevMemList: [], DevStrgList: [],

            EnableTestQASec: false, EnableDevelopmentSec: false, EnableSandBoxSec: false,
            TestQARadiobtnDisable: true, DevRadiobtnDisable: true, SandBoxRadiobtnDisable: true,

            TestQARadiobtn1: false, TestQARadiobtn2: false, TestQARadiobtn3: false,
            DevRadiobtn21: false, DevRadiobtn22: false, DevRadiobtn23: false,
            SandBoxRadiobtn31: false, SandBoxRadiobtn32: false, SandBoxRadiobtn33: false,

            OtherEnv: {}, ProdEnv: {},
            CombinedDataRow1:'Dedicated or Combined',
            CombinedDataRow2:'Dedicated or Combined',
            CombinedDataRow3:'Dedicated or Combined',

        }

        this.updateProcList = this.updateProcList.bind(this);
        this.updateProcQtyList = this.updateProcQtyList.bind(this);
        this.updateMemoryCalc = this.updateMemoryCalc.bind(this);
        this.updateMemQty = this.updateMemQty.bind(this);
        this.updateStorageCalc = this.updateStorageCalc.bind(this);

        this.PopulatingLables=this.PopulatingLables.bind(this);
        this.CommonFunctionLabels=this.CommonFunctionLabels.bind(this);
        this.UpdateWorkloadRadiobtns=this.UpdateWorkloadRadiobtns.bind(this);
        this.ModifyDedicatedSelection = this.ModifyDedicatedSelection.bind(this);

       // Combined RadioBtn Section Methods
        this.TestQARadioBtnChange = this.TestQARadioBtnChange.bind(this);
        this.DevRadioBtnChange = this.DevRadioBtnChange.bind(this);
        this.SandBoxRadioBtnChange = this.SandBoxRadioBtnChange.bind(this);
        this.CalcCombinedDBData = this.CalcCombinedDBData.bind(this);
    }

    componentWillMount(){
      if(this.props.sizerWorkLoad !== ''){

       if(this.props.activeSession.isSizeEnabled === false){
          this.props.OntoggleSizeButton(true);
       }

       ServerPlatform = this.props.sizerWorkLoad.UserInputs.Environments.ServerPlatform;
       if (ServerPlatform === "HPE ProLiant DL580 Gen9" ){  
           ProcList = ['E7-8890v4', 'E7-8880v4'];
       }else if (ServerPlatform === "HPE ProLiant DL560 Gen10" ){ 
           ProcList = ['8176', '8180', '8180M'];
       }else { }

       this.state.ProdEnv = this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment;
       this.state.OtherEnv = this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments;
       ProdDBSize = this.state.ProdEnv['MemorySize'];

       // Updating TestQA Section Data
        this.state.TestObj = this.state.OtherEnv['TestQA'];
        if(this.state.TestObj["TestQAselected"] == 'True'){
           this.state.EnableTestQASec = true;
           this.state.TestQARadiobtnDisable = false;
           // this.state.TestProcList = ProcList;
           this.state.TestProcList = [];
           var maxDBSize = ProdDBSize * ( this.state.TestObj['TestQADBSize'] / 100);
           this.state.TestObj['TestQADB'] = Math.ceil(maxDBSize).toString();
           this.updateProcList('TestQA');
        }else{
           this.state.EnableTestQASec = false;
           this.state.TestQARadiobtn1 = false;
        }

       // Updating Development System Section Data
        this.state.DevObj = this.state.OtherEnv['Dev'];
        if(this.state.DevObj["Devselected"] == "True" ){
           this.state.EnableDevelopmentSec = true;
           this.state.DevRadiobtnDisable = false;
           // this.state.DevProcList =  ProcList;
           this.state.DevProcList = [];
           var maxDBSize = ProdDBSize * ( this.state.DevObj['DevDBSize']  / 100);
           this.state.DevObj['DevDB'] = Math.ceil(maxDBSize).toString();
           this.updateProcList('Dev');
        }else{
           this.state.EnableDevelopmentSec=false;
           this.state.DevRadiobtn22=false;
        }

       // Updating SandBox Section Data
        this.state.SandBoxObj = this.state.OtherEnv['SandBox'];
        if(this.state.SandBoxObj["SandBoxselected"]== "True" ){
           this.state.EnableSandBoxSec=true;
           // this.state.SandBoxProcList =  ProcList;
           this.state.SandBoxProcList = [];
           var maxDBSize = ProdDBSize * ( this.state.SandBoxObj['SandBoxDBSize']  / 100);
           this.state.SandBoxObj['SandBoxDB'] = Math.ceil(maxDBSize).toString();
           this.updateProcList('SandBox');
           this.state.SandBoxRadiobtnDisable=false;
        }else{
           this.state.EnableSandBoxSec=false;
           this.state.SandBoxRadiobtn33=false;
        }
       
       this.PopulatingLables();
       this.CommonFunctionLabels();

       if( this.state.OtherEnv !== ""){           
            this.state.CombinedDataRow1 = this.state.OtherEnv["Caption1"];
            this.state.CombinedDataRow2 = this.state.OtherEnv["Caption2"];
            this.state.CombinedDataRow3 = this.state.OtherEnv["Caption3"];
       }
       
       if( this.state.OtherEnv["CombinedDB"]["CombinedCSHANA"] === undefined){
           this.state.OtherEnv["CombinedDB"]["CombinedCSHANA"] = 'HPE ConvergedSystem 500 for SAP HANA Compute Node';
           this.state.OtherEnv["CombinedDB"]["DevProcessor"] = '';
           this.state.OtherEnv["CombinedDB"]["DevMemory"] = '';
           this.state.OtherEnv["CombinedDB"]["DevMemoryQty"] = '';
           this.state.OtherEnv["CombinedDB"]["DevProcessorQty"] = '';
         }else{
           this.state.OtherEnv["CombinedDB"]["CombinedCSHANA"] = 'HPE ConvergedSystem 500 for SAP HANA Compute Node';
       }

       var Radiobuttongroup = this.state.OtherEnv["DBStack"];
                            if(Radiobuttongroup["rbTest1"] ==1){
                                this.state.TestQARadiobtn1=true;
                            }else{
                            }if(Radiobuttongroup["rbTest2"] ==1){
                                this.state.TestQARadiobtn2=true;
                            }else{
                            } if(Radiobuttongroup["rbTest3"] ==1){
                                    this.state.TestQARadiobtn3=true;
                            }else{
                            } if(Radiobuttongroup["rdDev1"] ==1){
                                    this.state.DevRadiobtn21=true;
                            }else {
                            }if(Radiobuttongroup["rdDev2"] ==1){
                                this.state.DevRadiobtn22=true;
                            }else{
                            } if(Radiobuttongroup["rdDev3"] ==1){
                                this.state.DevRadiobtn23=true;
                            }else{} if(Radiobuttongroup["rdSB1"] ==1){
                                    this.state.SandBoxRadiobtn31=true;
                            }else{} if(Radiobuttongroup["rdSB2"] ==1){
                                    this.state.SandBoxRadiobtn32=true;
                            }else{} if(Radiobuttongroup["rdSB3"] ==1){
                                    this.state.SandBoxRadiobtn33=true;
                            }

        // console.log(["rbTest1"])
        // console.log(this.state.OtherEnv);

      }
    }

    ModifyDedicatedSelection(){

        var DedicatedSelection =this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments;

        // console.log(this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.Caption1);
       if(this.state.TestQARadiobtn1 == true && this.state.DevRadiobtn21 == true && this.state.SandBoxRadiobtn31 == true){
              DedicatedSelection["CombinedDB"]["@selected"] = "True";
              DedicatedSelection["TestQA"]["@dedicated"] = "False";
              DedicatedSelection["Dev"]["@dedicated"] = "False";
              DedicatedSelection["SandBox"]["@dedicated"] = "False";

              this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["CombinedDB"]["Combinedsystems"]= "(Test/QA - Development - SandBox) Combined";
        }else if(this.state.TestQARadiobtn2 == true && this.state.DevRadiobtn22 == true &&this.state.SandBoxRadiobtn32 == true){
              DedicatedSelection["CombinedDB"]["@selected"] = "True";
              DedicatedSelection["TestQA"]["@dedicated"] = "False";
              DedicatedSelection["Dev"]["@dedicated"] = "False";
              DedicatedSelection["SandBox"]["@dedicated"] = "False";

              this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["CombinedDB"]["Combinedsystems"]=  "(Test/QA - Development - SandBox) Combined";
        }else if(this.state.TestQARadiobtn3==true && this.state.DevRadiobtn23==true && this.state.SandBoxRadiobtn33 ==true){
              DedicatedSelection["CombinedDB"]["@selected"] = "True";
              DedicatedSelection["TestQA"]["@dedicated"] = "False";
              DedicatedSelection["Dev"]["@dedicated"] = "False";
              DedicatedSelection["SandBox"]["@dedicated"] = "False";

              this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["CombinedDB"]["Combinedsystems"]=  "(Test/QA - Development - SandBox) Combined";
        }else if(this.state.TestQARadiobtn1==true && this.state.DevRadiobtn21==true && this.state.SandBoxRadiobtn31 ==false){
              DedicatedSelection["CombinedDB"]["@selected"] = "True";
              DedicatedSelection["TestQA"]["@dedicated"] = "False";
              DedicatedSelection["Dev"]["@dedicated"] = "False";

              if(this.state.EnableSandBoxSec){
                  DedicatedSelection["SandBox"]["@dedicated"] = "True";
              }else{
                   DedicatedSelection["SandBox"]["@dedicated"] = "False";
              }

              this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["CombinedDB"]["Combinedsystems"]= "(Test/QA - Development) Combined";
        }else if(this.state.TestQARadiobtn1==false && this.state.DevRadiobtn21==true && this.state.SandBoxRadiobtn31 ==true){
              DedicatedSelection["CombinedDB"]["@selected"] = "True";
              DedicatedSelection["Dev"]["@dedicated"] = "False";
              DedicatedSelection["SandBox"]["@dedicated"] = "False";
              if(this.state.EnableTestQASec){
                    DedicatedSelection["TestQA"]["@dedicated"] = "True";
            }else{
                   DedicatedSelection["TestQA"]["@dedicated"] = "False";
            }
              this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["CombinedDB"]["Combinedsystems"]= "(Development - SandBox) Combined";
        }else if(this.state.TestQARadiobtn1==true && this.state.DevRadiobtn21==false &&this.state.SandBoxRadiobtn31 ==true){
            DedicatedSelection["CombinedDB"]["@selected"] = "True";
            DedicatedSelection["TestQA"]["@dedicated"] = "False";
            DedicatedSelection["SandBox"]["@dedicated"] = "False";
          if(this.state.EnableDevelopmentSec){
                DedicatedSelection["Dev"]["@dedicated"] = "True";
             }else{
               DedicatedSelection["Dev"]["@dedicated"] = "False";
             }
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["CombinedDB"]["Combinedsystems"]= "(Test/QA - SandBox ) Combined";
        }else if(this.state.TestQARadiobtn2==true && this.state.DevRadiobtn22==true &&this.state.SandBoxRadiobtn32 ==false){
            DedicatedSelection["CombinedDB"]["@selected"] = "True";
            DedicatedSelection["TestQA"]["@dedicated"] = "False";
            DedicatedSelection["Dev"]["@dedicated"] = "False";
            if(this.state.EnableSandBoxSec){
                  DedicatedSelection["SandBox"]["@dedicated"] = "True";
              }else{
                   DedicatedSelection["SandBox"]["@dedicated"] = "False";
              }
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["CombinedDB"]["Combinedsystems"]= "(Test/QA - Development) Combined";
        }else if(this.state.TestQARadiobtn2==false && this.state.DevRadiobtn22==true &&this.state.SandBoxRadiobtn32 ==true){
            DedicatedSelection["CombinedDB"]["@selected"] = "True";
            DedicatedSelection["Dev"]["@dedicated"] = "False";
            DedicatedSelection["SandBox"]["@dedicated"] = "False";
            if(this.state.EnableTestQASec){
                    DedicatedSelection["TestQA"]["@dedicated"] = "True";
            }else{
                   DedicatedSelection["TestQA"]["@dedicated"] = "False";
            }
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["CombinedDB"]["Combinedsystems"]= "(Development - SandBox) Combined";
        }else if(this.state.TestQARadiobtn2==true && this.state.DevRadiobtn22==false &&this.state.SandBoxRadiobtn32 ==true){
             DedicatedSelection["CombinedDB"]["@selected"] = "True";
             DedicatedSelection["TestQA"]["@dedicated"] = "False";
             DedicatedSelection["SandBox"]["@dedicated"] = "False";
             if(this.state.EnableDevelopmentSec){
                DedicatedSelection["Dev"]["@dedicated"] = "True";
             }else{
               DedicatedSelection["Dev"]["@dedicated"] = "False";
             }
             this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["CombinedDB"]["Combinedsystems"]= "(Test/QA SandBox) Combined";
        }else if(this.state.TestQARadiobtn3==true && this.state.DevRadiobtn23==true &&this.state.SandBoxRadiobtn33 ==false){
            DedicatedSelection["CombinedDB"]["@selected"] = "True";
            DedicatedSelection["TestQA"]["@dedicated"] = "False";
            DedicatedSelection["Dev"]["@dedicated"] = "False";
             if(this.state.EnableSandBoxSec){
                  DedicatedSelection["SandBox"]["@dedicated"] = "True";
              }else{
                   DedicatedSelection["SandBox"]["@dedicated"] = "False";
              }

            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["CombinedDB"]["Combinedsystems"]= "(Test/QA - Development) Combined";
        }else if(this.state.TestQARadiobtn3==false && this.state.DevRadiobtn23==true &&this.state.SandBoxRadiobtn33 ==true){
              DedicatedSelection["CombinedDB"]["@selected"] = "True";
              DedicatedSelection["Dev"]["@dedicated"] = "False";
              DedicatedSelection["SandBox"]["@dedicated"] = "False";
              if(this.state.EnableTestQASec){
                    DedicatedSelection["TestQA"]["@dedicated"] = "True";
            }else{
                   DedicatedSelection["TestQA"]["@dedicated"] = "False";
            }

              this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["CombinedDB"]["Combinedsystems"]= "(Development - SandBox) Combined";
        }else if(this.state.TestQARadiobtn3==true && this.state.DevRadiobtn23==false &&this.state.SandBoxRadiobtn33 ==true){
            DedicatedSelection["CombinedDB"]["@selected"] = "True";
            DedicatedSelection["TestQA"]["@dedicated"] = "False";
            DedicatedSelection["SandBox"]["@dedicated"] = "False";
             if(this.state.EnableDevelopmentSec){
                DedicatedSelection["Dev"]["@dedicated"] = "True";
             }else{
               DedicatedSelection["Dev"]["@dedicated"] = "False";
             }
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["CombinedDB"]["Combinedsystems"]= "(Test/QA - SandBox) Combined";
        }else{
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["CombinedDB"]["Combinedsystems"]='';
                 DedicatedSelection["CombinedDB"]["@selected"] = "False";

                 if(this.state.EnableTestQASec){
                         DedicatedSelection["TestQA"]["@dedicated"] = "True";
                      }else{
                          DedicatedSelection["TestQA"]["@dedicated"] = "False";
                      }

                    if(this.state.EnableDevelopmentSec){
                            DedicatedSelection["Dev"]["@dedicated"] = "True";
                        }else{
                            DedicatedSelection["Dev"]["@dedicated"] = "False";
                        }

                  if(this.state.EnableSandBoxSec){
                        DedicatedSelection["SandBox"]["@dedicated"] = "True";
                    }else{
                        DedicatedSelection["SandBox"]["@dedicated"] = "False";
                    }
       }

       if(DedicatedSelection["CombinedDB"]["@selected"]  =="True"){
                  DedicatedSelection["CombinedDB"]["CombinedDBSize"] = parseInt(this.state.TestObj["TestQADBSize"]) + parseInt(this.state.DevObj["DevDBSize"]) + parseInt(this.state.SandBoxObj["SandBoxDBSize"]);
                  DedicatedSelection["CombinedDB"]["CombinedDB"]  = parseInt(this.state.TestObj["TestQADB"]) + parseInt(this.state.DevObj["DevDB"]) + parseInt(this.state.SandBoxObj["SandBoxDB"]);
                  DedicatedSelection["CombinedDB"]["CombinedHANA"]='HPE ConvergedSystem 500 for SAP HANA Compute Node'
              //    this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["@Selected"] = "True";
         }else{
                  DedicatedSelection["CombinedDB"]["CombinedDBSize"]  = '';
                  DedicatedSelection["CombinedDB"]["CombinedDB"]  = ''
                  DedicatedSelection["CombinedDB"]["CombinedHANA"]=''
           //       this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["@Selected"] = "False";
       }

       this.CalcCombinedDBData();
       var Radiobuttongroup = this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["DBStack"];
                           if(this.state.TestQARadiobtn1==true){
                             Radiobuttongroup["rbTest1"] =1
                           }else{
                                 Radiobuttongroup["rbTest1"]=0;
                           }
                           if(this.state.TestQARadiobtn2==true){
                              Radiobuttongroup["rbTest2"] =1;
                           }else{
                                Radiobuttongroup["rbTest2"] =0;
                           }
                           if(this.state.TestQARadiobtn3==true){
                               Radiobuttongroup["rbTest3"] =1
                           }else{
                                 Radiobuttongroup["rbTest3"]=0
                           }
                            if(this.state.DevRadiobtn21==true){
                               Radiobuttongroup["rdDev1"] =1;
                           }else {
                                Radiobuttongroup["rdDev1"] =0;
                           }
                           if(this.state.DevRadiobtn22==true){
                               Radiobuttongroup["rdDev2"] =1;
                           }else{
                               Radiobuttongroup["rdDev2"] =0;
                           }
                            if(this.state.DevRadiobtn23==true){
                               Radiobuttongroup["rdDev3"]=1;
                           }else{
                               Radiobuttongroup["rdDev3"]=0;
                           }
                            if(this.state.SandBoxRadiobtn31==true){
                                Radiobuttongroup["rdSB1"]=1;
                           }else{
                               Radiobuttongroup["rdSB1"]=0;
                           }
                            if(this.state.SandBoxRadiobtn32==true){
                                Radiobuttongroup["rdSB2"]=1;
                           }else{
                               Radiobuttongroup["rdSB2"]=0;
                           }
                            if(this.state.SandBoxRadiobtn33==true){
                                 Radiobuttongroup["rdSB3"] =1;
                           }else{
                                Radiobuttongroup["rdSB3"] =0;
                           }
    }

   // TestQA Section
    TestQASec(e){
        var obj = this.state.TestObj;
        this.state.TestMemory32GB = false;
        this.state.TestEnable32GB = false;
        this.state.TestEnable64GB = false;
        this.state.TestMemory64GB = false;
        // var errorObj = { isError: false, errorMsg: ''};
            // if( (this.state.TestObj['TestQAselected'] === "True" && this.state.TestObj['TestProcessor'] === 'Select Processor') ||
            //     (this.state.DevObj['Devselected'] === "True" && this.state.DevObj['DevProcessor'] === 'Select Processor' ) ||
            //     (this.state.SandBoxObj['SandBoxselected'] === "True" && this.state.SandBoxObj['SandBoxProcessor'] === 'Select Processor' ) ){

            //         errorObj = { isError: true, errorMsg: 'Please select the processor from the dropdown.'};
            //         this.props.updateError(errorObj);

            //  }else{
            //     errorObj = { isError: false, errorMsg: ''};
            //     this.props.updateError(errorObj);
            // }

        // }
        if(!this.state.EnableTestQASec){
            this.state.TestQARadiobtn1 = true;
            var maxDBSize = Math.ceil(ProdDBSize * ( obj['TestQADBSize'] / 100));
            obj["TestQAselected"] = 'True';
            obj["@dedicated"] = 'True';
            obj['TestQADB'] = maxDBSize.toString();
            obj['TestQADBSize'] = '1';
            obj['TestProcessor'] = '';
            obj['TestProcessorQty'] = '';
            obj['TestMemory'] = '';
            obj['TestStorage'] = '';
            if(this.state.TestQARadiobtn1){
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rbTest1 = 1;
            }
            this.state.TestProcList = [];
            this.state.TestQARadiobtnDisable = false;
            // this.state.TestProcList = ProcList;
            this.updateProcList('TestQA');            
            this.PopulatingLables();
            this.CommonFunctionLabels();
            //    if(this.state.TestQARadiobtn1==false && this.state.DevRadiobtn21==false && this.state.SandBoxRadiobtn31 ==false){
            //          this.state.CombinedDataRow1 ="Dedicated or Combined ";
            //   }
            this.setState({TestObj: obj, EnableTestQASec: true});
        }else{
            obj["TestQAselected"] = "False";
            obj["@dedicated"] = "False";
            obj['TestQADB'] ='';
            obj['TestQADBSize'] = '1';
            obj['TestProcessor'] = '';
            obj['TestProcessorQty'] = '';
            obj['TestMemory'] = '';
            obj['TestStorage'] = '';
            this.state.TestQARadiobtn1 = this.state.TestQARadiobtn2 = this.state.TestQARadiobtn3 = false;
            if(this.state.TestQARadiobtn1 == false){
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rbTest1 = 0;
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rbTest2 = 0;
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rbTest3 = 0;
            }
            this.state.TestProcList = [];
            this.state.TestQARadiobtnDisable = true;
            // this.updateProcList('TestQA');
            this.PopulatingLables();
            this.CommonFunctionLabels();
            //  if(this.state.TestQARadiobtn1==false && this.state.DevRadiobtn21==false && this.state.SandBoxRadiobtn31 ==false){
            //          this.state.CombinedDataRow1 ="Dedicated or Combined ";
            //   }
            this.setState({TestObj: obj, EnableTestQASec: false})
        }
        if(this.state.TestObj['@dedicated'] === 'True' ||
           this.state.DevObj['@dedicated'] === 'True' ||
           this.state.SandBoxObj['@dedicated'] === 'True'){
           this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["@Selected"] = "True";
        }else{
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["@Selected"] = "False";
        }
        this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['TestQA'] = obj;
    }

    TestQAsecDBPercChange(e){
        var obj = this.state.TestObj;
        if( e.target.value !== null ){
            obj['TestQADBSize'] = e.target.value;
            this.setState({ TestObj: obj });
        }
    }
    onTestQADBSizeValidate(){
        var obj = this.state.TestObj;
        var TestsecPerc = parseInt(obj['TestQADBSize'], 10);
        if( TestsecPerc === '' || TestsecPerc === 0 || isNaN(TestsecPerc) ){
            TestsecPerc = '1';
        }else if(TestsecPerc > 100){
            TestsecPerc = '100';
        }else if(TestsecPerc < 0){
            TestsecPerc = '1';
        }else{ }

        var maxDBSize = ProdDBSize * ( TestsecPerc / 100);
        obj['TestQADBSize'] = TestsecPerc.toString();
        obj['TestQADB'] = Math.ceil(maxDBSize).toString();
        // TestQA Processor list based on DBSize,
        this.updateProcList('TestQA');
        this.TestProcListChange({value: this.state.TestProcList[0]});

        this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['TestQA'] = obj;
        this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["TotalDBPercent"] = parseInt(this.state.TestObj["TestQADBSize"]) + parseInt(this.state.DevObj["DevDBSize"]) + parseInt(this.state.SandBoxObj["SandBoxDBSize"]);
        this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["TotalDBSize"] = parseInt(this.state.TestObj["TestQADB"]) + parseInt(this.state.DevObj["DevDB"]) + parseInt(this.state.SandBoxObj["SandBoxDB"]);
        this.setState({ TestObj: obj });
    }
    TestProcListChange(e){
        if(e.target != null){
            var obj = this.state.TestObj;
            obj['TestProcessor'] = e.value;
            this.state.TestObj = obj;
            this.updateProcQtyList('TestQA');
            this.TestQAProcQtyListChange({value: this.state.TestQAProcQtyList[0]});
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['TestQA'] = obj;
            this.setState({ TestObj: obj });
        }
    }
    TestQAProcQtyListChange(e){

        var obj = this.state.TestObj;
        obj['TestProcessorQty'] = e.value;
        this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['TestQA'] = obj;
        this.state.TestObj = obj;
        // Update Memory
        this.updateMemoryCalc('TestQA');
        this.setState({ TestObj: obj });
    }
    TestMemListChange(e){
        var obj = this.state.TestObj;
        obj['TestMemory'] = e.value;
        this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['TestQA'] = obj;
        this.state.TestObj = obj;
        // Update Storage
        this.updateStorageCalc('TestQA');
        this.setState({ TestObj: obj });
    }
    TestStrgListChange(e){
    }
   // Development Section
    DevSec(e){
        var obj = this.state.DevObj;
        this.state.DevMemory32GB = false;
        this.state.DevEnable32GB = false;
        this.state.DevEnable64GB = false;
        this.state.DevMemory64GB = false;
        // var errorObj = { isError: false, errorMsg: ''};
            // if( (this.state.TestObj['TestQAselected'] === "True" && this.state.TestObj['TestProcessor'] === 'Select Processor') ||
            //     (this.state.DevObj['Devselected'] === "True" && this.state.DevObj['DevProcessor'] === 'Select Processor' ) ||
            //     (this.state.SandBoxObj['SandBoxselected'] === "True" && this.state.SandBoxObj['SandBoxProcessor'] === 'Select Processor' ) ){

            //         errorObj = { isError: true, errorMsg: 'Please select the processor from the dropdown.'};
            //         this.props.updateError(errorObj);

            // }else{
            //     errorObj = { isError: false, errorMsg: ''};
            //     this.props.updateError(errorObj);
            // }

        // }
        if(!this.state.EnableDevelopmentSec){
            this.state.DevRadiobtn22 = true;            
            var maxDBSize = Math.ceil(ProdDBSize * ( obj['DevDBSize'] / 100));
            obj["Devselected"] = "True";
            obj["@dedicated"] = "True";
            obj['DevDB'] = maxDBSize.toString();
            obj['DevDBSize'] = '1';
            obj['DevProcessor'] = '';
            obj['DevProcessorQty'] = '';
            obj['DevMemory'] = '';
            obj['DevStorage'] = '';
            if(this.state.DevRadiobtn22){
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rdDev2 =1;
            }            
            this.state.DevProcList = [];
            this.state.DevRadiobtnDisable = false;
            // this.state.DevProcList = ProcList;
            this.updateProcList('Dev');
            this.PopulatingLables();
            this.CommonFunctionLabels();
            //    if(this.state.TestQARadiobtn1==false && this.state.DevRadiobtn21==false && this.state.SandBoxRadiobtn31 ==false){
            //          this.state.CombinedDataRow1 ="Dedicated or Combined ";
            //   }
            this.setState({DevObj: obj, EnableDevelopmentSec: true});
        }else{
            obj["Devselected"] = "False";
            obj["@dedicated"] = "False";
            obj['DevDBSize'] = '1';
            obj['DevDB'] ='';
            obj['DevProcessor'] = '';
            obj['DevProcessorQty'] = '';
            obj['DevMemory'] = '';
            obj['DevStorage'] = '';
            this.state.DevRadiobtn21 = this.state.DevRadiobtn22 = this.state.DevRadiobtn23 = false;
            if(this.state.DevRadiobtn22 ==false){
                  this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rdDev2 =0;
                  this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rdDev1 =0;
                  this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rdDev3 =0;
            }
            this.state.DevProcList=[];
            this.state.DevRadiobtnDisable=true;
            this.PopulatingLables();
            this.CommonFunctionLabels();
            //  if(this.state.TestQARadiobtn1==false && this.state.DevRadiobtn21==false && this.state.SandBoxRadiobtn31 ==false){
            //          this.state.CombinedDataRow1 ="Dedicated or Combined ";
            //   }
            this.setState({DevObj: obj, EnableDevelopmentSec: false})
        }
        if(this.state.TestObj['@dedicated'] === 'True' ||
           this.state.DevObj['@dedicated'] === 'True' ||
           this.state.SandBoxObj['@dedicated'] === 'True'){
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["@Selected"] = "True";
        }else{
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["@Selected"] = "False";
        }
        this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['Dev'] = obj;
    }

    DevsecDBPercChange(e){
        var obj = this.state.DevObj;
        if( e.target.value !== null ){
            obj['DevDBSize'] = e.target.value;
            this.setState({ DevObj: obj });
        }
    }

    onDevDBSizeValidate(){
        var obj = this.state.DevObj;
        var DevSecperc = parseInt(obj['DevDBSize'], 10);
        if( DevSecperc === '' || DevSecperc === 0 || isNaN(DevSecperc) ){
            DevSecperc = '1';
        }else if(DevSecperc > 100){
            DevSecperc = '100';
        }else if(DevSecperc < 0){
            DevSecperc = '1';
        }else{ }

        var maxDBSize = ProdDBSize * ( DevSecperc / 100);
        obj['DevDBSize'] = DevSecperc.toString();
        obj['DevDB'] = Math.ceil(maxDBSize).toString();
        // Dev Processor Qty list based on DBSize,
        this.updateProcList('Dev');
        this.DevProcListChange({value: this.state.DevProcList[0]});

        this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['Dev'] = obj;
        this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["TotalDBPercent"]  = parseInt(this.state.TestObj["TestQADBSize"]) + parseInt(this.state.DevObj["DevDBSize"]) + parseInt(this.state.SandBoxObj["SandBoxDBSize"]);
        this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["TotalDBSize"]  = parseInt(this.state.TestObj["TestQADB"]) + parseInt(this.state.DevObj["DevDB"]) + parseInt(this.state.SandBoxObj["SandBoxDB"]);
        this.setState({ DevObj: obj }); // , DevPercInputs: TestsecPerc });
    }

    DevProcListChange(e){
        if(e.target != null){
            var obj = this.state.DevObj;
            obj['DevProcessor'] = e.value;
            this.state.DevObj = obj;
            this.updateProcQtyList('Dev');
            this.DevProcQtyListChange({value: this.state.DevProcQtyList[0]});
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['Dev'] = obj;
            this.setState({ DevObj: obj });
        }
    }

    DevProcQtyListChange(e){        
        var obj = this.state.DevObj;
        obj['DevProcessorQty'] = e.value;
        this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['Dev'] = obj;
        this.state.DevObj = obj;
        // Update Memory
        this.updateMemoryCalc('Dev');
        this.setState({ DevObj: obj });
    }

    DevMemListChange(e){        
        var obj = this.state.DevObj;
        obj['DevMemory'] = e.value;
        this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['Dev'] = obj;
        this.state.DevObj = obj;
        // Update Storage
        this.updateStorageCalc('Dev');
        this.setState({ DevObj: obj });
    }

    DevStrgListChange(e){
    }

   // SandBox Section
    SandBoxSec(e){
        var obj = this.state.SandBoxObj;

        if(!this.state.EnableSandBoxSec){
            this.state.SandBoxRadiobtn33=true;

            var maxDBSize = Math.ceil(ProdDBSize * ( obj['SandBoxDBSize'] / 100));
            obj['SandBoxDB'] = maxDBSize.toString();
            obj['SandBoxDBSize'] = '1';
            obj['SandBoxProcessor'] = '';
            obj['SandBoxProcessorQty'] = '';
            obj['SandBoxMemory'] = '';
            obj["SandBoxselected"] = "True";
            obj["@dedicated"] = "True";
            if(this.state.SandBoxRadiobtn33){
               this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rdSB3 = 1;
            }

            this.state.SandBoxRadiobtnDisable=false;
            // this.state.SandBoxProcList = ProcList;
            this.state.SandBoxProcList = [];
            this.updateProcList('SandBox');

            this.PopulatingLables();
            this.CommonFunctionLabels();

            //    if(this.state.TestQARadiobtn1==false && this.state.DevRadiobtn21==false && this.state.SandBoxRadiobtn31 ==false){
            //          this.state.CombinedDataRow1 ="Dedicated or Combined ";
            //   }
            this.setState({SandBoxObj: obj, EnableSandBoxSec: true});
        }else{
             obj['SandBoxDB']='';
            obj["SandBoxselected"] = "False";
            obj['SandBoxDBSize'] = '1';
            obj['SandBoxProcessor'] = '';
            obj['SandBoxProcessorQty'] = '';
            obj['SandBoxMemory'] = '';
            obj['SandBoxStorage'] = '';
            obj["@dedicated"] = "False";

            this.state.SandBoxRadiobtn31=this.state.SandBoxRadiobtn32=this.state.SandBoxRadiobtn33=false;
            if(this.state.SandBoxRadiobtn33 == false){
                this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rdSB3 =0;
                 this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rdSB1 =0;
                 this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rdSB2 =0;
            }

            this.state.SandBoxProcList=[];
            this.state.SandBoxRadiobtnDisable=true;
            this.PopulatingLables();
             this.CommonFunctionLabels();
            this.setState({SandBoxObj: obj, EnableSandBoxSec: false})
        }
        // this.state.SandBoxMemory32GB = false;
        // this.state.SandBoxEnable32GB = false;
        // this.state.SandBoxEnable64GB = false;
        // this.state.SandBoxMemory64GB = false;

        //     var errorObj = { isError: false, errorMsg: ''};
        //     if( (this.state.TestObj['TestQAselected'] === "True" && this.state.TestObj['TestProcessor'] === 'Select Processor') ||
        //         (this.state.DevObj['Devselected'] === "True" && this.state.DevObj['DevProcessor'] === 'Select Processor' ) ||
        //         (this.state.SandBoxObj['SandBoxselected'] === "True" && this.state.SandBoxObj['SandBoxProcessor'] === 'Select Processor' ) ){
        //             errorObj = { isError: true, errorMsg: 'Please select the processor from the dropdown.'};
        //             this.props.updateError(errorObj);
        //      }else{
        //             errorObj = { isError: false, errorMsg: ''};
        //             this.props.updateError(errorObj);
        //     }

        // }

        if(this.state.TestObj['@dedicated'] === 'True' ||
           this.state.DevObj['@dedicated'] === 'True' ||
           this.state.SandBoxObj['@dedicated'] === 'True')
        {
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["@Selected"] = "True";
        }else{
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["@Selected"] = "False";
        }

        this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['SandBox'] = obj;
    }

    SandBoxsecDBPercChange(e){
        var obj = this.state.SandBoxObj;
        if( e.target.value !== null ){
            obj['SandBoxDBSize'] = e.target.value;
            this.setState({ SandBoxObj: obj });
        }
    }

    onSandBoxDBSizeValidate(){
        var obj = this.state.SandBoxObj;
        var SandBoxSecperc = parseInt(obj['SandBoxDBSize'], 10);
        if( SandBoxSecperc === '' || SandBoxSecperc === 0 || isNaN(SandBoxSecperc) ){
            SandBoxSecperc = '1';
        }else if(SandBoxSecperc > 100){
            SandBoxSecperc = '100';
        }else if(SandBoxSecperc < 0){
            SandBoxSecperc = '1';
        }else{ }

        var maxDBSize = ProdDBSize * ( SandBoxSecperc / 100);
        obj['SandBoxDBSize'] = SandBoxSecperc.toString();
        obj['SandBoxDB'] = Math.ceil(maxDBSize).toString();
        // SandBox Processor list based on DBSize,
        this.updateProcList('SandBox');
        this.SandBoxProcListChange({value: this.state.SandBoxProcList[0]});

        this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['SandBox'] = obj;
        this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["TotalDBPercent"]  = parseInt(this.state.TestObj["TestQADBSize"]) + parseInt(this.state.DevObj["DevDBSize"]) + parseInt(this.state.SandBoxObj["SandBoxDBSize"]);
        this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments["TotalDBSize"]  = parseInt(this.state.TestObj["TestQADB"]) + parseInt(this.state.DevObj["DevDB"]) + parseInt(this.state.SandBoxObj["SandBoxDB"]);
        this.setState({ SandBoxObj: obj }); // , SandBoxPercInputs: SandBoxsecPerc });
    }

    SandBoxProcListChange(e){
        if(e.target != null){
            var obj = this.state.SandBoxObj;
            obj['SandBoxProcessor'] = e.value;
            this.state.SandBoxObj = obj;
            this.updateProcQtyList('SandBox');
            this.SandBoxProcQtyListChange({value: this.state.SandBoxProcQtyList[0]});
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['SandBox'] = obj;
            this.setState({ SandBoxObj: obj });
        }
    }

    SandBoxProcQtyListChange(e){
        var obj = this.state.SandBoxObj;
        obj['SandBoxProcessorQty'] = e.value;
        this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['SandBox'] = obj;
        this.state.SandBoxObj = obj;
        // Update Memory
        this.updateMemoryCalc('SandBox');
        this.setState({ SandBoxObj: obj });
    }
    
    SandBoxMemListChange(e){
        var obj = this.state.SandBoxObj;
        obj['SandBoxMemory'] = e.value;
        this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['SandBox'] = obj;
        this.state.SandBoxObj = obj;
        // Update Storage
        this.updateStorageCalc('SandBox');
        this.setState({ SandBoxObj: obj });
    }

    SandBoxStrgListChange(e){

    }

   // Common Logic for Proc List, Proc Qty & Memory Calculations
    updateProcList(Item){
        switch(Item){
            case 'TestQA': {
                            var obj = this.state.TestObj;
                            var DBSize = this.state.TestObj['TestQADB'];
                            // Test Processor's List based on DBSize,
                            try{                                
                                if (ServerPlatform === "HPE ProLiant DL580 Gen9"){
                                    if( DBSize > 4096 ){
                                        this.state.TestProcList = ["No Processors found"];
                                        this.state.TestObj['TestProcessor'] = 'No Processors found';
                                        var errorObj = { isError: true, errorMsg: 'The Required HANA Memory size for these inputs is currently too large.' + "\n" + 'Kindly contact our HPE representative for further advice.'};
                                        if(!this.props.GlobalError.isError){
                                            this.props.updateError(errorObj);
                                        }
                                    }else if (DBSize > 1536 && DBSize <= 2048){
                                        this.state.TestProcList = ["E7-8890v4"];
                                    }else if (DBSize > 3072 && DBSize <= 4096){
                                        this.state.TestProcList = ["E7-8890v4"];
                                    }else{
                                        this.state.TestProcList = ["E7-8890v4", "E7-8880v4"];
                                    }   
                                }else if (ServerPlatform === "HPE ProLiant DL560 Gen10"){
                                    if (DBSize > 6144){
                                        this.state.TestProcList = ["No Processors found"];
                                        this.state.TestObj['TestProcessor'] = 'No Processors found';
                                        var errorObj = { isError: true, errorMsg: 'The Required HANA Memory size for these inputs is currently too large.' + "\n" + 'Kindly contact our HPE representative for further advice.'};
                                        if(!this.props.GlobalError.isError){
                                        this.props.updateError(errorObj);
                                        }
                                    }else if (DBSize > 3072) {
                                        this.state.TestProcList = ["8180M"];
                                    }else if (DBSize > 1536){
                                        this.state.TestProcList = ["8176", "8180", "8180M"];
                                    }else{
                                        this.state.TestProcList = ["8176", "8180"];
                                    }
                                }else{ }

                                if( this.state.TestProcList.indexOf(obj['TestProcessor']) === -1 ){
                                    obj['TestProcessor'] = this.state.TestProcList[0];
                                }
                                this.state.TestObj = obj;
                                this.updateProcQtyList('TestQA');
                            }
                            catch (e) {
                                console.log(e);
                            }
                            break;
            }
            case 'Dev': {
                            var obj = this.state.DevObj;
                            var DBSize = this.state.DevObj['DevDB'];
                            // Dev Processor's List based on DBSize,
                            try{
                                if (ServerPlatform === "HPE ProLiant DL580 Gen9"){
                                    if( DBSize > 4096 ){
                                        this.state.DevProcList = ["No Processors found"];
                                        this.state.DevObj['DevProcessor'] = 'No Processors found';
                                        var errorObj = { isError: true, errorMsg: 'The Required HANA Memory size for these inputs is currently too large.' + "\n" + 'Kindly contact our HPE representative for further advice.'};
                                        if(!this.props.GlobalError.isError){
                                            this.props.updateError(errorObj);
                                        }
                                    }else if (DBSize > 1536 && DBSize <= 2048){
                                        this.state.DevProcList = ["E7-8890v4"];
                                    }else if (DBSize > 3072 && DBSize <= 4096){
                                        this.state.DevProcList = ["E7-8890v4"];
                                    }else{
                                        this.state.DevProcList = ["E7-8890v4", "E7-8880v4"];
                                    }   
                                }else if (ServerPlatform === "HPE ProLiant DL560 Gen10"){
                                    if (DBSize > 6144){
                                        this.state.DevProcList = ["No Processors found"];
                                        this.state.DevObj['DevProcessor'] = 'No Processors found';
                                        var errorObj = { isError: true, errorMsg: 'The Required HANA Memory size for these inputs is currently too large.' + "\n" + 'Kindly contact our HPE representative for further advice.'};
                                        if(!this.props.GlobalError.isError){
                                        this.props.updateError(errorObj);
                                        }
                                    }else if (DBSize > 3072) {
                                        this.state.DevProcList = ["8180M"];
                                    }else if (DBSize > 1536){
                                        this.state.DevProcList = ["8176", "8180", "8180M"];
                                    }else{
                                        this.state.DevProcList = ["8176", "8180"];
                                    }
                                }else{ }

                                if( this.state.DevProcList.indexOf(obj['DevProcessor']) === -1 ){
                                    obj['DevProcessor'] = this.state.DevProcList[0];
                                }
                                this.state.DevObj = obj;
                                this.updateProcQtyList('Dev');
                            }
                            catch (e) {
                                console.log(e);
                            }
                            break;
            }
            case 'SandBox': {
                             var obj = this.state.SandBoxObj;
                             var DBSize = this.state.SandBoxObj['SandBoxDB'];
                            // List SandBox Processors based on DBSize,
                            try{
                                if (ServerPlatform === "HPE ProLiant DL580 Gen9"){
                                    if( DBSize > 4096 ){
                                        this.state.SandBoxProcList = ["No Processors found"];
                                        this.state.SandBoxObj['SandBoxProcessor'] = 'No Processors found';
                                        var errorObj = { isError: true, errorMsg: 'The Required HANA Memory size for these inputs is currently too large.' + "\n" + 'Kindly contact our HPE representative for further advice.'};
                                        if(!this.props.GlobalError.isError){
                                            this.props.updateError(errorObj);
                                        }
                                    }else if (DBSize > 1536 && DBSize <= 2048){
                                        this.state.SandBoxProcList = ["E7-8890v4"];
                                    }else if (DBSize > 3072 && DBSize <= 4096){
                                        this.state.SandBoxProcList = ["E7-8890v4"];
                                    }else{
                                        this.state.SandBoxProcList = ["E7-8890v4", "E7-8880v4"];
                                    }   
                                }else if (ServerPlatform === "HPE ProLiant DL560 Gen10"){
                                    if (DBSize > 6144){
                                        this.state.SandBoxProcList = ["No Processors found"];
                                        this.state.SandBoxObj['SandBoxProcessor'] = 'No Processors found';
                                        var errorObj = { isError: true, errorMsg: 'The Required HANA Memory size for these inputs is currently too large.' + "\n" + 'Kindly contact our HPE representative for further advice.'};
                                        if(!this.props.GlobalError.isError){
                                        this.props.updateError(errorObj);
                                        }
                                    }else if (DBSize > 3072) {
                                        this.state.SandBoxProcList = ["8180M"];
                                    }else if (DBSize > 1536){
                                        this.state.SandBoxProcList = ["8176", "8180", "8180M"];
                                    }else{
                                        this.state.SandBoxProcList = ["8176", "8180"];
                                    }
                                }else{ }

                                if( this.state.SandBoxProcList.indexOf(obj['SandBoxProcessor']) === -1 ){
                                    obj['SandBoxProcessor'] = this.state.SandBoxProcList[0];
                                }
                                this.state.SandBoxObj = obj;
                                this.updateProcQtyList('SandBox');
                            }
                            catch (e) {
                                console.log(e);
                            }
                            break;
            }
        }
    }
    updateProcQtyList(Item){
        switch(Item){
            case 'TestQA': {
                            var obj = this.state.TestObj;
                            var DBSize = this.state.TestObj['TestQADB'];
                            // Test Processor's Qty list based on DBSize,                            
                            // Skylake Changes
                            try{
                                if (ServerPlatform === "HPE ProLiant DL580 Gen9"){
                                    if (DBSize <= 128){
                                        this.state.TestQAProcQtyList = ['2'];
                                    }else if (DBSize > 128 && DBSize <= 2048){
                                        this.state.TestQAProcQtyList = ['2','4'];
                                    }else if (DBSize > 2048 && DBSize <= 4096){
                                        this.state.TestQAProcQtyList = ['4'];
                                    }
                                    this.state.TestObj['TestProcessorQty'] = this.state.TestQAProcQtyList[0];
                                }else if (ServerPlatform === "HPE ProLiant DL560 Gen10"){
                                    if (this.state.TestObj['TestProcessor'].indexOf("M") > 0){
                                        if (DBSize <= 3072){
                                            this.state.TestQAProcQtyList = ['2'];
                                        }else{
                                            this.state.TestQAProcQtyList = ['4'];
                                        }
                                    }else{
                                        if (DBSize <= 1536){
                                            this.state.TestQAProcQtyList = ['2', '4'];
                                        }else{
                                            this.state.TestQAProcQtyList = ['4'];
                                        }
                                    }
                                }else { }
                            
                                if( this.state.TestQAProcQtyList.indexOf(obj['TestProcessorQty']) === -1 ){
                                    obj['TestProcessorQty'] = this.state.TestQAProcQtyList[0];
                                }                                
                                this.state.TestObj = obj;
                                this.updateMemoryCalc('TestQA');
                            }
                            catch (e) {
                                console.log(e);
                            }
                            break;
                            // if( DBSize <= 128 ){
                                //     this.state.TestQAProcQtyList = ['2'];
                                // }else if( DBSize > 128 && DBSize <= 2048 ){
                                //     this.state.TestQAProcQtyList = ['2','4'];
                                // }else if( DBSize > 2048 ){
                                //     this.state.TestQAProcQtyList = ['4'];
                            // }
            }
            case 'Dev': {
                            var obj = this.state.DevObj;
                            var DBSize = this.state.DevObj['DevDB'];
                            // Dev Processor's Qty list based on DBSize,                            
                            // Skylake Changes
                            try {
                                if (ServerPlatform === "HPE ProLiant DL580 Gen9"){
                                    if (DBSize <= 128){
                                        this.state.DevProcQtyList = ['2'];
                                    }else if (DBSize > 128 && DBSize <= 2048){
                                        this.state.DevProcQtyList = ['2','4'];
                                    }else if (DBSize > 2048 && DBSize <= 4096){
                                        this.state.DevProcQtyList = ['4'];
                                    }
                                    this.state.DevObj['DevProcessorQty'] = this.state.DevProcQtyList[0];
                                }else if (ServerPlatform === "HPE ProLiant DL560 Gen10"){
                                    if (this.state.DevObj['DevProcessor'].indexOf("M") > 0){
                                        if (DBSize <= 3072){
                                            this.state.DevProcQtyList = ['2'];
                                        }else{
                                            this.state.DevProcQtyList = ['4'];
                                        }
                                    }else{
                                        if (DBSize <= 1536){
                                            this.state.DevProcQtyList = ['2', '4'];
                                        }else{
                                            this.state.DevProcQtyList = ['4'];
                                        }
                                    }
                                }else { }

                                if( this.state.DevProcQtyList.indexOf(obj['DevProcessorQty']) === -1 ){
                                    obj['DevProcessorQty'] = this.state.DevProcQtyList[0];
                                }       
                                this.state.DevObj = obj;
                                this.updateMemoryCalc('Dev');
                            }
                            catch (e) {
                                console.log(e);
                            }
                            break;
            }
            case 'SandBox': {
                            var obj = this.state.SandBoxObj;
                            var DBSize = this.state.SandBoxObj['SandBoxDB'];
                            // SandBox Processor's Qty list based on DBSize,                            
                            // Skylake Changes
                            try {
                                if (ServerPlatform === "HPE ProLiant DL580 Gen9"){
                                    if (DBSize <= 128){
                                        this.state.SandBoxProcQtyList = ['2'];
                                    }else if (DBSize > 128 && DBSize <= 2048){
                                        this.state.SandBoxProcQtyList = ['2','4'];
                                    }else if (DBSize > 2048 && DBSize <= 4096){
                                        this.state.SandBoxProcQtyList = ['4'];
                                    }
                                    this.state.SandBoxObj['SandBoxProcessorQty'] = this.state.SandBoxProcQtyList[0];
                                }else if (ServerPlatform === "HPE ProLiant DL560 Gen10"){
                                    if (this.state.SandBoxObj['SandBoxProcessor'].indexOf("M") > 0){
                                        if (DBSize <= 3072){
                                            this.state.SandBoxProcQtyList = ['2'];
                                        }else{
                                            this.state.SandBoxProcQtyList = ['4'];
                                        }
                                    }else{
                                        if (DBSize <= 1536){
                                            this.state.SandBoxProcQtyList = ['2', '4'];
                                        }else{
                                            this.state.SandBoxProcQtyList = ['4'];
                                        }
                                    }
                                }else { }

                                if( this.state.SandBoxProcQtyList.indexOf(obj['SandBoxProcessorQty']) === -1 ){
                                    obj['SandBoxProcessorQty'] = this.state.SandBoxProcQtyList[0];
                                }       
                                this.state.SandBoxObj = obj;
                                this.updateMemoryCalc('SandBox');
                            }
                            catch (e) {
                                console.log(e);
                            }
                            break;
            }
        }
    }
    updateMemoryCalc(Item){        
        var ServObj = {};        
        SupportedList.Server.filter( (item, index) => {
            if(item['@Name'] === ServerPlatform ){
                ServObj = item;
            }
        });
        switch(Item){
            case 'TestQA': {
                            var obj = this.state.TestObj;
                            var DBSize = obj['TestQADB'];
                            DBSize = parseInt(DBSize, 10);
                            TestMemoryList = {};
                            var selProcQty = this.state.TestObj['TestProcessorQty']; 
                            var ProcItem = ServObj.MemoryOptions.find(function (elem){
                                if( elem['@ProcQty'] === selProcQty){
                                    return elem;
                                }
                            });    
                            this.state.TestMemList = [];
                            var check = true;

                            ProcItem.Memory.map( (memItem, index) => {
                                if ( DBSize <= parseInt(memItem["@Size"], 10) && check ){
                                    if(memItem['@isCombined'] === null || memItem['@isCombined'] === undefined ){
                                        if(Array.isArray(memItem.Item)){
                                            memItem.Item.map( (item, index) => {                             
                                                // if(Object.Keys(TestMemoryList).indexOf( item["@DIMMSize"] + " GB") === -1 ){
                                                //   TestMemoryList[item["@DIMMSize"] + " GB"] = item["@Qty"];
                                                // }
                                                this.state.TestMemList.push( item["@DIMMSize"] + " GB" ); 
                                            });
                                        }else{
                                            // if(Object.Keys(TestMemoryList).indexOf( memItem.Item["@DIMMSize"] + " GB") === -1 ){
                                            //   TestMemoryList[ memItem.Item["@DIMMSize"] + " GB"] = memItem.Item["@Qty"];
                                            // }
                                            this.state.TestMemList.push( memItem.Item["@DIMMSize"] + " GB" );
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
                                        this.state.TestMemList.push( strMemDIMM );
                                    } 
                                    check = false;
                                }    
                            });
                                
                            // if( this.state.TestMemList.indexOf(obj['TestMemory']) === -1 ){
                            //     obj['TestMemory'] = this.state.TestMemList[0];
                            // }         
                            obj['TestMemory'] = this.state.TestMemList[0];
                            //  old method
                                // obj['TestMemoryQty'] = this.updateMemQty(obj['TestQADB'], obj['TestMemory']); 
                                      
                            // New Skylake method
                                // this.updateMemoryQty(obj['TestMemory']);
                                // this.updateStorageList(DBSize, obj['TestProcessor'], selProcQty);

                            this.state.TestObj = obj;
                            // this.updateStorageCalc('TestQA');
                            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['TestQA'] = this.state.TestObj = obj;
                            break;
            }
            case 'Dev': {
                            var obj = this.state.DevObj;
                            var DBSize = obj['DevDB'];                                               
                            DBSize = parseInt(DBSize, 10);
                            DevMemoryList = {};
                            var selProcQty = this.state.DevObj['DevProcessorQty'];
                            var ProcItem = ServObj.MemoryOptions.find(function (elem){
                                if( elem['@ProcQty'] === selProcQty){
                                    return elem;
                                }
                            });                            
                            this.state.DevMemList = [];
                            var check = true;
                           
                            ProcItem.Memory.map( (memItem, index) => {
                                if ( DBSize <= parseInt(memItem["@Size"], 10) && check ){
                                    if(memItem['@isCombined'] === null || memItem['@isCombined'] === undefined ){
                                        if(Array.isArray(memItem.Item)){
                                            memItem.Item.map( (item, index) => {                             
                                                // if(Object.Keys(DevMemoryList).indexOf( item["@DIMMSize"] + " GB") === -1 ){
                                                //   DevMemoryList[item["@DIMMSize"] + " GB"] = item["@Qty"];
                                                // }
                                                this.state.DevMemList.push( item["@DIMMSize"] + " GB" ); 
                                            });
                                        }else{
                                            // if(Object.Keys(DevMemoryList).indexOf( memItem.Item["@DIMMSize"] + " GB") === -1 ){
                                            //   DevMemoryList[ memItem.Item["@DIMMSize"] + " GB"] = memItem.Item["@Qty"];
                                            // }
                                            this.state.DevMemList.push( memItem.Item["@DIMMSize"] + " GB" );
                                        }
                                    }else{
                                        var strMemDIMM = '';
                                        memItem.Item.map( (item, index) => {
                                            strMemDIMM = (strMemDIMM === '' || strMemDIMM === null || strMemDIMM === undefined) ? 
                                                            item["@DIMMSize"] + " GB" : 
                                                            strMemDIMM + " & " + item["@DIMMSize"] + " GB";
                                            // if(Object.Keys(DevMemoryList).indexOf( strMemDIMM ) === -1 ){
                                            //   DevMemoryList[ strMemDIMM ] = item["@Qty"];
                                            // }
                                        });
                                        this.state.DevMemList.push( strMemDIMM );
                                    } 
                                    check = false;
                                }    
                            });
                               
                            // if( this.state.DevMemList.indexOf(obj['DevMemory']) === -1 ){
                            //     obj['DevMemory'] = this.state.DevMemList[0];
                            // }         
                            obj['DevMemory'] = this.state.DevMemList[0];
                            //  old method
                                // obj['DevMemoryQty'] = this.updateMemQty(obj['DevDB'], obj['DevMemory']); 
                                      
                            // New Skylake method
                                // this.updateMemoryQty(obj['DevMemory']);
                                // this.updateStorageList(DBSize, obj['DevProcessor'], selProcQty);

                            this.state.DevObj = obj;
                            // this.updateStorageCalc('Dev');
                            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['Dev'] = this.state.DevObj = obj;
                            break;
            }
            case 'SandBox': {                      
                            var obj = this.state.SandBoxObj;
                            var DBSize = obj['SandBoxDB'];                                               
                            DBSize = parseInt(DBSize, 10);                                                        
                            SBMemoryList = {};
                            var selProcQty = this.state.SandBoxObj['SandBoxProcessorQty'];
                            var ProcItem = ServObj.MemoryOptions.find(function (elem){
                                if( elem['@ProcQty'] === selProcQty){
                                    return elem;
                                }
                            });
                            this.state.SandBoxMemList = [];
                            var check = true;

                            ProcItem.Memory.map( (memItem, index) => {
                                if ( DBSize <= parseInt(memItem["@Size"], 10) && check ){
                                    if(memItem['@isCombined'] === null || memItem['@isCombined'] === undefined ){
                                        if(Array.isArray(memItem.Item)){
                                            memItem.Item.map( (item, index) => {                             
                                                // if(Object.Keys(SBMemoryList).indexOf( item["@DIMMSize"] + " GB") === -1 ){
                                                //   SBMemoryList[item["@DIMMSize"] + " GB"] = item["@Qty"];
                                                // }
                                                this.state.SandBoxMemList.push( item["@DIMMSize"] + " GB" ); 
                                            });
                                        }else{
                                            // if(Object.Keys(SBMemoryList).indexOf( memItem.Item["@DIMMSize"] + " GB") === -1 ){
                                            //   SBMemoryList[ memItem.Item["@DIMMSize"] + " GB"] = memItem.Item["@Qty"];
                                            // }
                                            this.state.SandBoxMemList.push( memItem.Item["@DIMMSize"] + " GB" );
                                        }
                                    }else{
                                        var strMemDIMM = '';
                                        memItem.Item.map( (item, index) => {
                                            strMemDIMM = (strMemDIMM === '' || strMemDIMM === null || strMemDIMM === undefined) ? 
                                                            item["@DIMMSize"] + " GB" : 
                                                            strMemDIMM + " & " + item["@DIMMSize"] + " GB";
                                            // if(Object.Keys(SBMemoryList).indexOf( strMemDIMM ) === -1 ){
                                            //   SBMemoryList[ strMemDIMM ] = item["@Qty"];
                                            // }
                                        });
                                        this.state.SandBoxMemList.push( strMemDIMM );
                                    } 
                                    check = false;
                                }    
                            });

                            // if( this.state.SandBoxMemList.indexOf(obj['SandBoxMemory']) === -1 ){
                            //     obj['SandBoxMemory'] = this.state.SandBoxMemList[0];
                            // }         
                            obj['SandBoxMemory'] = this.state.SandBoxMemList[0];
                            //  old method
                                // obj['SandBoxMemoryQty'] = this.updateMemQty(obj['SandBoxDB'], obj['SandBoxMemory']); 
                                      
                            // New Skylake method
                                // this.updateMemoryQty(obj['SandBoxMemory']);
                                // this.updateStorageList(DBSize, obj['SandBoxProcessor'], selProcQty);

                            this.state.SandBoxObj = obj;
                            // this.updateStorageCalc('SandBox');
                            
                            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['SandBox'] = this.state.SandBoxObj = obj;
                            break;
            }
        }
    }
    updateMemQty(DBSize, MemorySize){
        // Memory Range
        // 128GB, 256GB, 384GB, 512GB, 768GB, 1024GB, 1536GB, 2048GB, 3072GB and 4072GB

        DBSize = parseInt(DBSize, 10);
         var SelMem = MemorySize.split(' ');
         SelMem = SelMem[0];
        //   if(MemorySize.toString().length>2){
        //      SelMem = MemorySize.substr(0,2);
        //   }else{
        //       SelMem= MemorySize;
        //   }

      //  var SelMem = MemorySize.substr(0,2);
        SelMem = parseInt(SelMem, 10);
        var CheckDB = 0;

        if(DBSize <= 128){
        CheckDB = 128;
        }else if(DBSize <= 256 ){
        CheckDB = 256;
        }else if(DBSize <= 384){
        CheckDB = 384;
        }else if(DBSize <= 512){
        CheckDB = 512;
        }else if(DBSize <= 768){
        CheckDB = 768;
        }else if(DBSize <= 1024){
        CheckDB = 1024;
        }else if(DBSize <= 1536){
        CheckDB = 1536;
        }else if(DBSize <= 2048){
        CheckDB = 2048;
        }else if(DBSize <= 3072){
        CheckDB = 3072;
        }else if(DBSize <= 4072){
        CheckDB = 4072;
        }else{
        CheckDB = 0;
        }
        return Math.ceil(CheckDB/SelMem).toString();
    }
    updateStorageCalc(Item){
        switch(Item){
            case 'TestQA': {
                            var obj = this.state.TestObj;
                            var DBSize = obj['TestQADB'];  
                            var strProc = obj['TestProcessor'];                    
                            var strProcQty = obj['TestProcessorQty']; 
                            if (DBSize <= 768){
                                this.state.TestStrgList = ['Regular', 'Large'];
                            }else if (DBSize > 768 && DBSize <= 3072){
                                this.state.TestStrgList = ['Large'];
                                if(strProc.indexOf("M") > 0 && strProcQty === "2" && (DBSize > 1536 && DBSize <= 3072)){
                                    this.state.TestStrgList = ['Extra Large'];
                                }
                                if (strProc.indexOf("M") > 0 && strProcQty === "4" && (DBSize > 1536 && DBSize <= 3072)){
                                    this.state.TestStrgList = ['Large'];
                                }
                            }else if(DBSize > 3072){ // && strProcQty === "4"){
                                    this.state.TestStrgList = ['Extra Large'];
                            } 
                            this.state.TestObj['TestStorage'] = ''; 
                            this.state.TestObj['TestStorage'] = this.state.TestStrgList[0];
                            // this.setState({StorageValue: this.state.TestStrgList[0]});

                            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['TestQA'] = this.state.TestObj = obj;
                            break;
            }
            case 'Dev': {
                            var obj = this.state.DevObj;
                            var DBSize = obj['DevDB'];
                            var strProc = obj['DevProcessor'];                    
                            var strProcQty = obj['DevProcessorQty']; 
                            if (DBSize <= 768){
                                this.state.DevStrgList = ['Regular', 'Large'];
                            }else if (DBSize > 768 && DBSize <= 3072){
                                this.state.DevStrgList = ['Large'];
                                if(strProc.indexOf("M") > 0 && strProcQty === "2" && (DBSize > 1536 && DBSize <= 3072)){
                                    this.state.DevStrgList = ['Extra Large'];
                                }
                                if (strProc.indexOf("M") > 0 && strProcQty === "4" && (DBSize > 1536 && DBSize <= 3072)){
                                    this.state.DevStrgList = ['Large'];
                                }
                            }else if(DBSize > 3072){ // && strProcQty === "4"){
                                    this.state.DevStrgList = ['Extra Large'];
                            } 
                            this.state.DevObj['DevStorage'] = ''; 
                            this.state.DevObj['DevStorage'] = this.state.DevStrgList[0];
                            // this.setState({StorageValue: this.state.TestStrgList[0]});

                            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['Dev'] = this.state.DevObj = obj;
                            break;
            }
            case 'SandBox': {
                            var obj = this.state.SandBoxObj;
                            var DBSize = obj['SandBoxDB'];
                            var strProc = obj['SandBoxProcessor'];                    
                            var strProcQty = obj['SandBoxProcessorQty'];
                            
                            if (DBSize <= 768){
                                this.state.SandBoxStrgList = ['Regular', 'Large'];
                            }else if (DBSize > 768 && DBSize <= 3072){
                                this.state.SandBoxStrgList = ['Large'];
                                if(strProc.indexOf("M") > 0 && strProcQty === "2" && (DBSize > 1536 && DBSize <= 3072)){
                                    this.state.SandBoxStrgList = ['Extra Large'];
                                }
                                if (strProc.indexOf("M") > 0 && strProcQty === "4" && (DBSize > 1536 && DBSize <= 3072)){
                                    this.state.SandBoxStrgList = ['Large'];
                                }
                            }else if(DBSize > 3072){ // && strProcQty === "4"){
                                    this.state.SandBoxStrgList = ['Extra Large'];
                            } 
                            this.state.SandBoxObj['SandBoxStorage'] = ''; 
                            this.state.SandBoxObj['SandBoxStorage'] = this.state.SandBoxStrgList[0];
                            // this.setState({StorageValue: this.state.TestStrgList[0]});

                            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments['SandBox'] = this.state.SandBoxObj = obj;
                            break;
            }
        }
    }

   // Common Logic for RadioButton Combinedsystems Selections
    UpdateWorkloadRadiobtns(){
        if(this.state.TestQARadiobtn1 ==true){
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rbTest1 =1;
        }else{
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rbTest1 =0;
        }
        if(this.state.TestQARadiobtn2 ==true){
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rbTest2 =1;
        }else{
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rbTest2 =0;
        }
        if(this.state.TestQARadiobtn3 ==true){
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rbTest3 =1;
        }else{
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rbTest3 =0;
        }
        if(this.state.DevRadiobtn21 ==true){
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rdDev1 =1;
        }else{
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rdDev1=0;
        }
        if(this.state.DevRadiobtn22 ==true){
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rdDev2=1;
        }else{
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rdDev2=0;
        }
        if(this.state.DevRadiobtn23 ==true){
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rdDev3=1;
        }else{
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rdDev3=0;
        }
        if(this.state.SandBoxRadiobtn31 ==true){
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rdSB1=1;
        }else{
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rdSB1=0;
        }
        if(this.state.SandBoxRadiobtn32 ==true){
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rdSB2=1;
        }else{
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rdSB2=0;
        }
        if(this.state.SandBoxRadiobtn33 ==true){
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rdSB3=1;
        }else{
            this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.DBStack.rdSB3=0;
        }

    }

    CalcCombinedDBData(){

       this.state.cmbTestQAStorage = ''; 
       this.state.cmbDevStorage = '';
       this.state.cmbSandBoxStorage = '';

       var CombinedDB = '';
        var DBSize = 0;
        var DBPerc = 0;
        var MemorySize = 0;

        var TestProcessor =''
        var TestProcessorQty =''
        var TestMemory = '';
        var TestMemoryQty =''

        var DevProcessor =''
        var DevProcessorQty =''
        var DevMemory = '';
        var DevMemoryQty =''

        var SandBoxProcessor =''
        var SandBoxProcessorQty =''
        var SandBoxMemory = '';
        var SandBoxMemoryQty =''
        var CombinedDBData = this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.CombinedDB;
        var TestData = this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.TestQA;
        var DevData = this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.Dev;
        var SandBoxData = this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.SandBox;

       if(CombinedDBData["@selected"] === "False"){
              CombinedDBData["DevProcessor"]='';
              CombinedDBData["DevProcessorQty"]='';
              CombinedDBData["DevMemory"]='';
              CombinedDBData["DevMemoryQty"]='';

              var errorObj = {isError: false, errorMsg: ''};
              if( this.props.activeSession.globalError !== '' && this.props.activeSession.globalError.isError &&
                  this.props.activeSession.globalError.errorMsg.indexOf("Overall") !== -1 ){
                  this.props.updateError(errorObj);
              }

       }else{
            if(this.state.CombinedDataRow1.indexOf('-') > 0){
                CombinedDB = this.state.CombinedDataRow1;
            }
            if(this.state.CombinedDataRow2.indexOf('-') > 0){
                CombinedDB = this.state.CombinedDataRow2;
            }
            if(this.state.CombinedDataRow3.indexOf('-') > 0){
                CombinedDB = this.state.CombinedDataRow3;
            }

            if(CombinedDB.indexOf('Test') > 0){
                DBPerc += parseInt(TestData['TestQADBSize'], 10);
                // DBSize += parseInt(TestData['TestQADB'], 10);
                MemorySize += parseInt(TestData['TestMemory'].split(' ')[0], 10);

                TestProcessor = TestData['TestProcessor'];
                TestProcessorQty = TestData['TestProcessorQty'];
                TestMemory = TestData['TestMemory'];
                TestMemoryQty = TestData['TestMemoryQty'];
            }
            if(CombinedDB.indexOf('Dev') > 0){
                DBPerc += parseInt(DevData['DevDBSize'], 10);
                // DBSize += parseInt(DevData['DevDB'], 10);
                MemorySize += parseInt(DevData['DevMemory'].split(' ')[0], 10);

                DevProcessor = DevData['DevProcessor'];
                DevProcessorQty = DevData['DevProcessorQty'];
                DevMemory = DevData['DevMemory'];
                DevMemoryQty = DevData['DevMemoryQty'];
            }
            if(CombinedDB.indexOf('SandBox') > 0){
                DBPerc += parseInt(SandBoxData['SandBoxDBSize'], 10);
                // DBSize += parseInt(SandBoxData['SandBoxDB'], 10);
                MemorySize += parseInt(SandBoxData['SandBoxMemory'].split(' ')[0], 10);
                SandBoxProcessor = SandBoxData['SandBoxProcessor'];
                SandBoxProcessorQty = SandBoxData['SandBoxProcessorQty'];
                SandBoxMemory = SandBoxData['SandBoxMemory'];
                SandBoxMemoryQty = SandBoxData['SandBoxMemoryQty'] ;
            }

            // if(TestProcessor !== '' || DevProcessor !== '' || SandBoxProcessor !== '' ){
            //           if(TestProcessor === "E7-8890v4" || DevProcessor === "E7-8890v4" || SandBoxProcessor === "E7-8890v4"){
            //                  CombinedDBData["DevProcessor"]="E7-8890v4"
            //           }else{
            //                 CombinedDBData["DevProcessor"]="E7-8880v4"
            //           }
            //   }else{
            // }

            DBSize = Math.ceil((DBPerc/100)*this.props.sizerWorkLoad.UserInputs.Environments.ProductionEnvironment['MemorySize']);
            CombinedDBData['CombinedDBSize'] = DBPerc;
            CombinedDBData['CombinedDB'] = DBSize;
            // if(CombinedDBData['CombinedDB'] >= 1024){
            if(CombinedDBData['CombinedDB'] > 768){
                  CombinedDBData["DevMemory"] = 64
                  CombinedDBData["DevProcessorQty"] = 4
             }else{
                  CombinedDBData["DevMemory"] = 32
                  CombinedDBData["DevProcessorQty"] = 2
            }

            if(CombinedDBData['CombinedDB'] <= 128){
                        CombinedDBData["DevMemoryQty"]=128/CombinedDBData["DevMemory"];
                        var errorObj = { isError: false, errorMsg: ''};

                        if(this.props.activeSession.globalError !== '' && this.props.activeSession.globalError.isError &&
                        this.props.activeSession.globalError.errorMsg.indexOf('Overall') >= 0)
                        {
                            this.props.updateError(errorObj);
                            // this.props.OntoggleSizeButton(false);
                        }
                    }else if(CombinedDBData['CombinedDB'] <= 256 ){
                        CombinedDBData["DevMemoryQty"]=256/CombinedDBData["DevMemory"];
                        var errorObj = { isError: false, errorMsg: ''};
                        if(this.props.activeSession.globalError !== '' && this.props.activeSession.globalError.isError &&
                        this.props.activeSession.globalError.errorMsg.indexOf('Overall') >= 0){
                            this.props.updateError(errorObj);
                            // this.props.OntoggleSizeButton(false);
                        }
                    }else if(CombinedDBData['CombinedDB'] <= 384){
                        CombinedDBData["DevMemoryQty"]=384/CombinedDBData["DevMemory"];
                        var errorObj = { isError: false, errorMsg: ''};
                        if(this.props.activeSession.globalError !== '' && this.props.activeSession.globalError.isError &&
                        this.props.activeSession.globalError.errorMsg.indexOf('Overall') >= 0){
                            this.props.updateError(errorObj);
                            // this.props.OntoggleSizeButton(false);
                        }
                    }else if(CombinedDBData['CombinedDB'] <= 512){
                        CombinedDBData["DevMemoryQty"]=512/CombinedDBData["DevMemory"];
                        var errorObj = { isError: false, errorMsg: ''};
                        if(this.props.activeSession.globalError !== '' && this.props.activeSession.globalError.isError &&
                        this.props.activeSession.globalError.errorMsg.indexOf('Overall') >= 0){
                            this.props.updateError(errorObj);
                            // this.props.OntoggleSizeButton(false);
                        }
                    }else if(CombinedDBData['CombinedDB'] <= 768){
                        CombinedDBData["DevMemoryQty"]=768/CombinedDBData["DevMemory"];
                        var errorObj = { isError: false, errorMsg: ''};
                        if(this.props.activeSession.globalError !== '' && this.props.activeSession.globalError.isError &&
                        this.props.activeSession.globalError.errorMsg.indexOf('Overall') >= 0){
                            this.props.updateError(errorObj);
                            // this.props.OntoggleSizeButton(false);
                        }
                    }else if(CombinedDBData['CombinedDB'] <= 1024){
                        CombinedDBData["DevMemoryQty"]=1024/CombinedDBData["DevMemory"];
                        var errorObj = { isError: false, errorMsg: ''};
                        if(this.props.activeSession.globalError !== '' && this.props.activeSession.globalError.isError &&
                        this.props.activeSession.globalError.errorMsg.indexOf('Overall') >= 0){
                            this.props.updateError(errorObj);
                            // this.props.OntoggleSizeButton(false);
                        }
                    }else if(CombinedDBData['CombinedDB'] <= 1536){
                        CombinedDBData["DevMemoryQty"]=1536/CombinedDBData["DevMemory"];
                        var errorObj = { isError: false, errorMsg: ''};
                        if(this.props.activeSession.globalError !== '' && this.props.activeSession.globalError.isError &&
                        this.props.activeSession.globalError.errorMsg.indexOf('Overall') >= 0){
                            this.props.updateError(errorObj);
                            // this.props.OntoggleSizeButton(false);
                        }
                    }else if(CombinedDBData['CombinedDB'] <= 2048){
                        CombinedDBData["DevMemoryQty"]=2048/CombinedDBData["DevMemory"];
                        var errorObj = { isError: false, errorMsg: ''};
                        if(this.props.activeSession.globalError !== '' && this.props.activeSession.globalError.isError &&
                        this.props.activeSession.globalError.errorMsg.indexOf('Overall') >= 0){
                            this.props.updateError(errorObj);
                            // this.props.OntoggleSizeButton(false);
                        }
                    }else if(CombinedDBData['CombinedDB'] <= 3072){
                        CombinedDBData["DevMemoryQty"]=3072/CombinedDBData["DevMemory"];

                        var errorObj = { isError: false, errorMsg: ''};
                        if(this.props.activeSession.globalError !== '' && this.props.activeSession.globalError.isError &&
                        this.props.activeSession.globalError.errorMsg.indexOf('Overall') >= 0){
                            this.props.updateError(errorObj);
                            // this.props.OntoggleSizeButton(false);
                        }

                    }else if(CombinedDBData['CombinedDB'] <= 4072){
                        CombinedDBData["DevMemoryQty"]= Math.ceil(4072/CombinedDBData["DevMemory"]);
                        var errorObj = { isError: false, errorMsg: ''};
                        if(this.props.activeSession.globalError !== '' && this.props.activeSession.globalError.isError &&
                        this.props.activeSession.globalError.errorMsg.indexOf('Overall') >= 0){
                            this.props.updateError(errorObj);
                            // this.props.OntoggleSizeButton(false);
                        }
                    }else{
                        var errorObj = { isError: true,
                                    errorMsg: 'The Overall HANA Memory required for the combined system exceeds the Maximum Memory capacity (4TB). Select a separate system instead of combined approach.'};
                        if(this.props.activeSession.globalError !== '' && this.props.activeSession.globalError.isError === false){
                            this.props.updateError(errorObj);
                            // this.props.OntoggleSizeButton(false);
                        }
            }
        }
        this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.CombinedDB = CombinedDBData;
    }

    PopulatingLables(){
        if(this.state.TestQARadiobtn1==true && this.state.DevRadiobtn21==true && this.state.SandBoxRadiobtn31 ==true){
            this.state.CombinedDataRow1 ="(Test/QA - Development - SandBox) Combined";
            }else if(this.state.TestQARadiobtn1==true && this.state.DevRadiobtn21==true &&this.state.SandBoxRadiobtn31 ==false){
                this.state.CombinedDataRow1 ="(Test/QA - Development) Combined";
            }else if(this.state.TestQARadiobtn1==false && this.state.DevRadiobtn21==true &&this.state.SandBoxRadiobtn31 ==true){
                this.state.CombinedDataRow1 ="( Development - SandBox) Combined";
            }else if(this.state.TestQARadiobtn1==true && this.state.DevRadiobtn21==false &&this.state.SandBoxRadiobtn31 ==true){
                this.state.CombinedDataRow1 ="(Test/QA  - SandBox) Combined";
            }else if(this.state.TestQARadiobtn1==true && this.state.DevRadiobtn21==false &&this.state.SandBoxRadiobtn31 ==false){
                this.state.CombinedDataRow1 ="Dedicated Test/QA ";
            }else if(this.state.TestQARadiobtn1==false && this.state.DevRadiobtn21==true &&this.state.SandBoxRadiobtn31 ==false){
                this.state.CombinedDataRow1 ="Dedicated Development ";
            }else if(this.state.TestQARadiobtn1==false && this.state.DevRadiobtn21==false && this.state.SandBoxRadiobtn31 ==true){
                this.state.CombinedDataRow1 ="Dedicated SandBox ";
            }else{
        }

        if(this.state.TestQARadiobtn2==true && this.state.DevRadiobtn22==true && this.state.SandBoxRadiobtn32 ==true){
            this.state.CombinedDataRow2 ="(Test/QA - Development - SandBox) Combined";
            }else if(this.state.TestQARadiobtn2==true && this.state.DevRadiobtn22==true && this.state.SandBoxRadiobtn32 ==false){
                this.state.CombinedDataRow2 ="(Test/QA - Development) Combined";
            }else if(this.state.TestQARadiobtn2==false && this.state.DevRadiobtn22==true && this.state.SandBoxRadiobtn32 ==true){
                this.state.CombinedDataRow2 ="( Development - SandBox) Combined";
            }else if(this.state.TestQARadiobtn2==true && this.state.DevRadiobtn22==false && this.state.SandBoxRadiobtn32 ==true){
                this.state.CombinedDataRow2 ="(Test/QA  - SandBox) Combined";
            }else if(this.state.TestQARadiobtn2==true && this.state.DevRadiobtn22==false && this.state.SandBoxRadiobtn32 ==false){
                this.state.CombinedDataRow2 ="Dedicated Test/QA";
            }else if(this.state.TestQARadiobtn2==false && this.state.DevRadiobtn22==true && this.state.SandBoxRadiobtn32 ==false){
                this.state.CombinedDataRow2 ="Dedicated Development";
            }else if(this.state.TestQARadiobtn2==false && this.state.DevRadiobtn22==false && this.state.SandBoxRadiobtn32 ==true){
                this.state.CombinedDataRow2 ="Dedicated SandBox ";
            }else{
        }

        if(this.state.TestQARadiobtn3==true && this.state.DevRadiobtn23==true && this.state.SandBoxRadiobtn33 ==true){
            this.state.CombinedDataRow3 ="(Test/QA - Development - SandBox) Combined";
            }else if(this.state.TestQARadiobtn3==true && this.state.DevRadiobtn23==true && this.state.SandBoxRadiobtn33 ==false){
                this.state.CombinedDataRow3 ="(Test/QA - Development) Combined";
            }else if(this.state.TestQARadiobtn3==false && this.state.DevRadiobtn23==true && this.state.SandBoxRadiobtn33 ==true){
                this.state.CombinedDataRow3 ="( Development - SandBox) Combined";
            }else if(this.state.TestQARadiobtn3==true && this.state.DevRadiobtn23==false && this.state.SandBoxRadiobtn33 ==true){
                this.state.CombinedDataRow3 ="(Test/QA  - SandBox) Combined";
            }else if(this.state.TestQARadiobtn3==true && this.state.DevRadiobtn23==false && this.state.SandBoxRadiobtn33 ==false){
                this.state.CombinedDataRow3 ="Dedicated Test/QA";
            }else if(this.state.TestQARadiobtn3==false && this.state.DevRadiobtn23==true && this.state.SandBoxRadiobtn33 ==false){
                this.state.CombinedDataRow3 ="Dedicated Development";
            }else if(this.state.TestQARadiobtn3==false && this.state.DevRadiobtn23==false && this.state.SandBoxRadiobtn33 ==true){
                this.state.CombinedDataRow3 ="Dedicated SandBox ";
            }else{
        }
    }

    CommonFunctionLabels(){
        if(this.state.TestQARadiobtn1 ==false &&  this.state.DevRadiobtn21 == false && this.state.SandBoxRadiobtn31== false){
            this.state.CombinedDataRow1="Dedicated or Combined"
        }
        if(this.state.TestQARadiobtn2 ==false &&  this.state.DevRadiobtn22 == false && this.state.SandBoxRadiobtn32== false){
            this.state.CombinedDataRow2="Dedicated or Combined"
        }
        if(this.state.TestQARadiobtn3 ==false &&  this.state.DevRadiobtn23 == false && this.state.SandBoxRadiobtn33== false){
            this.state.CombinedDataRow3="Dedicated or Combined"
        }

        this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.Caption1=this.state.CombinedDataRow1;
        this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.Caption2=this.state.CombinedDataRow2;
        this.props.sizerWorkLoad.UserInputs.Environments.OtherEnvironments.Caption3=this.state.CombinedDataRow3;
    }

    TestQARadioBtnChange(e){
        if(e.target.attributes["id"].value == "choice1-1"){
            this.state.TestQARadiobtn1=true;this.state.TestQARadiobtn2=false,this.state.TestQARadiobtn3=false;
        }else if(e.target.attributes["id"].value == "choice1-2"){
            this.state.TestQARadiobtn1=false;this.state.TestQARadiobtn2=true,this.state.TestQARadiobtn3=false;
        }else if(e.target.attributes["id"].value == "choice1-3"){
            this.state.TestQARadiobtn1=false;this.state.TestQARadiobtn2=false,this.state.TestQARadiobtn3=true;
        }else{
        }

        this.UpdateWorkloadRadiobtns();
        this.PopulatingLables();
        this.CommonFunctionLabels();
        this.setState({});
    }

    DevRadioBtnChange(e){
        if(e.target.attributes["id"].value == "choice2-1"){
            this.state.DevRadiobtn21=true;this.state.DevRadiobtn22=false,this.state.DevRadiobtn23=false;
        }else if(e.target.attributes["id"].value == "choice2-2"){
            this.state.DevRadiobtn21=false;this.state.DevRadiobtn22=true,this.state.DevRadiobtn23=false;
        }else if(e.target.attributes["id"].value == "choice2-3"){
            this.state.DevRadiobtn21=false;this.state.DevRadiobtn22=false,this.state.DevRadiobtn23=true;
        }else{
        }
        this.UpdateWorkloadRadiobtns();
        this.PopulatingLables();
        this.CommonFunctionLabels();
        this.setState({});
    }

    SandBoxRadioBtnChange(e){
        if(e.target.attributes["id"].value == "choice3-1"){
            this.state.SandBoxRadiobtn31=true;this.state.SandBoxRadiobtn32=false,this.state.SandBoxRadiobtn33=false;
        }else if(e.target.attributes["id"].value == "choice3-2"){
            this.state.SandBoxRadiobtn31=false;this.state.SandBoxRadiobtn32=true,this.state.SandBoxRadiobtn33=false;
        }else if(e.target.attributes["id"].value == "choice3-3"){
            this.state.SandBoxRadiobtn31=false;this.state.SandBoxRadiobtn32=false,this.state.SandBoxRadiobtn33=true;
        }else{
        }

        this.UpdateWorkloadRadiobtns();
        this.PopulatingLables();
        this.CommonFunctionLabels();
        this.setState({});
    }

   // Rendering UI Logic
    render(){

      if(this.props.sizerWorkLoad !== ''){
          this.PopulatingLables();
          this.CommonFunctionLabels();
          this.ModifyDedicatedSelection();
        //    this.PopulatingLables();
       //   this.CommonFunctionLabels();
        var notevisible = '';
        var ProcQtyContent = '';

        // if((this.state.EnableTestQASec && (this.state.TestEnable32GB && this.state.TestEnable64GB)) ||
        //     (this.state.EnableDevelopmentSec && (this.state.DevEnable32GB && this.state.DevEnable64GB)) ||
        //     (this.state.EnableSandBoxSec && (this.state.SandBoxEnable32GB && this.state.SandBoxEnable64GB))
        // ){
        //     notevisible =
        //     <Box margin='none' direction="row" pad={{between: 'small'}} >
        //         <Heading tag='h4' strong={true} style={{color:'#01a982',marginLeft:'1%'}}  >Note: </Heading>
        //         <Heading tag='h4' style={{color:'#ff8d6d',fontSize:'16px',margin:'0px',fontWeight:'500'}} >Your Configuration allows the selection of two different memory module types, please choose the preferred option.</Heading>
        //     </Box>
        // }

        // if((this.state.EnableTestQASec && (this.state.TestObj['TestProcessor'] !== 'Select Processor' )) ||
        //     (this.state.EnableDevelopmentSec && (this.state.DevObj['DevProcessor'] !== 'Select Processor' )) ||
        //     (this.state.EnableSandBoxSec && (this.state.SandBoxObj['SandBoxProcessor'] !== 'Select Processor' ))
        // ){
        //     ProcQtyContent =
        //             <TableRow>
        //                 <td>Processor Quantity</td>
        //                 <td> <Select value={this.state.TestObj['TestProcessorQty']}
        //                              options={this.state.TestQAProcQtyList}
        //                              onChange={this.TestQAProcQtyListChange.bind(this)}
        //                              className='DropdownStyle' />
        //                 </td>
        //                 <td> <Select value={this.state.DevObj['DevProcessorQty']}
        //                             options={this.state.DevProcQtyList}
        //                             onChange={this.DevProcQtyListChange.bind(this)}
        //                             className='DropdownStyle' />
        //                 </td>
        //                 <td> <Select value={this.state.SandBoxObj['SandBoxProcessorQty']}
        //                              options={this.state.SandBoxProcQtyList}
        //                              onChange={this.SandBoxProcQtyListChange.bind(this)}
        //                              className='DropdownStyle' />
        //                 </td>
        //             </TableRow>
        // }else{
        //     ProcQtyContent = '';
        // }
      }
         
         // Processor list
          var   ProcessorHeading="";
          if(this.state.TestObj['TestProcessor'] !== '' ||  this.state.DevObj['DevProcessor'] !== '' ||  this.state.SandBoxObj['SandBoxProcessor'] !== ''){
                 ProcessorHeading='Processor List';
          }else{
                ProcessorHeading = '';
          }
           var TestProcessorDropDown='';
           var DevelopmentProcessorDropDown='';
           var SandBoxProcessorDropDown='';
          if(this.state.TestObj['TestProcessor'] !== ''){
                TestProcessorDropDown= <Select value={this.state.TestObj['TestProcessor']} options={this.state.TestProcList}  onChange={this.TestProcListChange.bind(this)} className='DropdownStyle' />
          }else{
               TestProcessorDropDown='';
          }
          if(this.state.DevObj['DevProcessor'] !== ''){
                  DevelopmentProcessorDropDown= <Select value={this.state.DevObj['DevProcessor']} options={this.state.DevProcList}  onChange={this.DevProcListChange.bind(this)} className='DropdownStyle' />

          }else{
               DevelopmentProcessorDropDown='';
          }
          if(this.state.SandBoxObj['SandBoxProcessor'] !== ''){
                 SandBoxProcessorDropDown=<Select value={this.state.SandBoxObj['SandBoxProcessor']} options={this.state.SandBoxProcList}  onChange={this.SandBoxProcListChange.bind(this)} className='DropdownStyle' />
          }else{
              SandBoxProcessorDropDown='';
          }


         // Processor Quantity list
          var   ProcessorQuantityHeading="";
          if(this.state.TestObj['TestProcessor'] !== '' ||  this.state.DevObj['DevProcessor'] !== '' ||  this.state.SandBoxObj['SandBoxProcessor'] !== ''){
                 ProcessorQuantityHeading='Processor Quantity';
          }else{
                ProcessorQuantityHeading=""
          }
           var TestProcessorQuantityDropDown='';
           var DevelopmentProcessorQuantityDropDown='';
           var SandBoxProcessorQuantityDropDown='';
          if(this.state.TestObj['TestProcessor'] !== ''){
                TestProcessorQuantityDropDown= <Select value={this.state.TestObj['TestProcessorQty']} options={this.state.TestQAProcQtyList}  onChange={this.TestQAProcQtyListChange.bind(this)} className='DropdownStyle' />
          }else{
               TestProcessorQuantityDropDown='';
          }
          if(this.state.DevObj['DevProcessor'] !== ''){
                  DevelopmentProcessorQuantityDropDown= <Select value={this.state.DevObj['DevProcessorQty']} options={this.state.DevProcQtyList}  onChange={this.DevProcQtyListChange.bind(this)} className='DropdownStyle' />

          }else{
               DevelopmentProcessorQuantityDropDown='';
          }
          if(this.state.SandBoxObj['SandBoxProcessor'] !== ''){
                 SandBoxProcessorQuantityDropDown=<Select value={this.state.SandBoxObj['SandBoxProcessorQty']} options={this.state.SandBoxProcQtyList}  onChange={this.SandBoxProcQtyListChange.bind(this)} className='DropdownStyle' />
          }else{
              SandBoxProcessorQuantityDropDown='';
          }

         // Memory list
          var MemoryHeading="";
          if(this.state.TestObj['TestMemory'] !== '' ||  this.state.DevObj['DevMemory'] !== '' ||  this.state.SandBoxObj['SandBoxMemory'] !== ''){
             MemoryHeading='Smart Memory Option';
          }else{
             MemoryHeading='';
          }

          var TestMemoryDropDown = '';
          var DevMemoryDropDown = '';
          var SandBoxMemoryDropDown = '';
          if(this.state.TestObj['TestMemory'] !== ''){
                TestMemoryDropDown= <Select value={this.state.TestObj['TestMemory']} options={this.state.TestMemList} className='DropdownStyle' onChange={this.TestMemListChange.bind(this)}/>
          }else{
               TestMemoryDropDown='';
          }
          if(this.state.DevObj['DevMemory'] !== ''){
               DevMemoryDropDown= <Select value={this.state.DevObj['DevMemory']} options={this.state.DevMemList} className='DropdownStyle' onChange={this.DevMemListChange.bind(this)}/>

          }else{
               DevMemoryDropDown='';
          }
          if(this.state.SandBoxObj['SandBoxMemory'] !== ''){
              SandBoxMemoryDropDown = <Select value={this.state.SandBoxObj['SandBoxMemory']} options={this.state.SandBoxMemList} className='DropdownStyle' onChange={this.SandBoxMemListChange.bind(this)} />
          }else{
              SandBoxMemoryDropDown='';
          }

       return(
          <Box pad='small' margin='none' style={{position:'relative', width: '100%'}}>
                {/*   <Box margin="none" pad="none" separator="bottom" style={{width: '100%',paddingBottom:'5px', height: '50px'}}>
                        <Title>Build your own solutions - 3 of 3</Title>
                </Box>  */}
                <Article full={true} margin="none" pad={{between: 'small'}} style={{ maxHeight: '96%' }} >
                    <Heading tag='h5' strong={true} margin='small' style={{ marginTop: '0%' }}>
                        System Landscape Besides Production Environment
                    </Heading>
                    <Box margin="none" pad="none" separator="all">
                        <Table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th><CheckBox value label='Test/QA System' checked={this.state.EnableTestQASec} onChange={this.TestQASec.bind(this)}/></th>
                                    <th><CheckBox value label='Development System' checked={this.state.EnableDevelopmentSec} onChange={this.DevSec.bind(this)}/></th>
                                    <th><CheckBox value label='SandBox System'  checked={this.state.EnableSandBoxSec} onChange={this.SandBoxSec.bind(this)}/></th>
                                </tr>
                            </thead>
                            <tbody>
                                <TableRow>
                                    <td>Percentage of Database Size compared to Production Database</td>
                                    <td><NumberInput value={this.state.TestObj['TestQADBSize']} disabled={!this.state.EnableTestQASec} min={1} max={100} onChange={this.TestQAsecDBPercChange.bind(this)} onBlur={this.onTestQADBSizeValidate.bind(this)} className="InputNumberFildsOtherEnv"/></td>
                                    <td><NumberInput value={this.state.DevObj["DevDBSize"]} disabled={!this.state.EnableDevelopmentSec} min={1} max={100} onChange={this.DevsecDBPercChange.bind(this)} onBlur={this.onDevDBSizeValidate.bind(this)} className="InputNumberFildsOtherEnv"/></td>
                                    <td><NumberInput value={this.state.SandBoxObj["SandBoxDBSize"]} disabled={!this.state.EnableSandBoxSec} min={1} max={100} onChange={this.SandBoxsecDBPercChange.bind(this)} onBlur={this.onSandBoxDBSizeValidate.bind(this)} className="InputNumberFildsOtherEnv"/></td>
                                </TableRow>
                                <TableRow>
                                    <td>{ProcessorHeading}</td>
                                    <td>{TestProcessorDropDown}</td>
                                    <td>{DevelopmentProcessorDropDown}</td>
                                    <td>{SandBoxProcessorDropDown}</td>
                                </TableRow>
                                <TableRow>
                                    <td>{ProcessorQuantityHeading}</td>
                                    <td>{TestProcessorQuantityDropDown}</td>
                                    <td>{DevelopmentProcessorQuantityDropDown}</td>
                                    <td>{SandBoxProcessorQuantityDropDown}</td>
                                </TableRow>
                                <TableRow>
                                    <td>{MemoryHeading}</td>
                                    <td>{TestMemoryDropDown}</td>
                                    <td>{DevMemoryDropDown}</td>
                                    <td>{SandBoxMemoryDropDown}</td>
                                </TableRow>                    
                            </tbody>
                        </Table>
                        { notevisible }
                    </Box>
                    <Heading tag='h5' strong={true} margin='small' >
                        Database Stacking Options
                    </Heading>
                    <Box margin="none" pad="none" separator="all">
                        <Table>
                            <thead>
                                <tr>
                                    <td></td>
                                    <td style={{ textAlign:'center' }}>{this.state.CombinedDataRow1}</td>
                                    <td style={{ textAlign:'center' }}>{this.state.CombinedDataRow2} </td>
                                    <td style={{ textAlign:'center' }}>{this.state.CombinedDataRow3} </td>
                                </tr>
                            </thead>
                            <tbody>
                                <TableRow>
                                    <td>Test/QA System</td>
                                    <td style={{textAlign:'center'}}> <RadioButton id='choice1-1' name='choice11' label=''  checked={this.state.TestQARadiobtn1} onChange={this.TestQARadioBtnChange} disabled={this.state.TestQARadiobtnDisable}/> </td>
                                    <td style={{textAlign:'center'}}> <RadioButton id='choice1-2' name='choice11' label=''  checked={this.state.TestQARadiobtn2} onChange={this.TestQARadioBtnChange} disabled={this.state.TestQARadiobtnDisable}/></td>
                                    <td style={{textAlign:'center'}}> <RadioButton id='choice1-3' name='choice11' label=''  checked={this.state.TestQARadiobtn3} onChange={this.TestQARadioBtnChange} disabled={this.state.TestQARadiobtnDisable}/></td>
                                </TableRow>
                                <TableRow>
                                    <td>Development System</td>
                                    <td style={{textAlign:'center'}}> <RadioButton id='choice2-1' name='choice2-1' label=''  checked={this.state.DevRadiobtn21} onChange={this.DevRadioBtnChange} disabled={this.state.DevRadiobtnDisable}/></td>
                                    <td style={{textAlign:'center'}}> <RadioButton id='choice2-2' name='choice2-1' label=''  checked={this.state.DevRadiobtn22} onChange={this.DevRadioBtnChange}  disabled={this.state.DevRadiobtnDisable}/></td>
                                    <td style={{textAlign:'center'}}> <RadioButton id='choice2-3' name='choice2-1' label=''  checked={this.state.DevRadiobtn23} onChange={this.DevRadioBtnChange}  disabled={this.state.DevRadiobtnDisable}/></td>
                                </TableRow>
                                <TableRow>
                                    <td>SandBox System</td>
                                    <td style={{textAlign:'center'}}> <RadioButton id='choice3-1' name='choice3-1' label=''  checked={this.state. SandBoxRadiobtn31} onChange={this.SandBoxRadioBtnChange}  disabled={this.state.SandBoxRadiobtnDisable}/></td>
                                    <td style={{textAlign:'center'}}> <RadioButton id='choice3-2' name='choice3-1' label=''  checked={this.state. SandBoxRadiobtn32} onChange={this.SandBoxRadioBtnChange}  disabled={this.state.SandBoxRadiobtnDisable}/></td>
                                    <td style={{textAlign:'center'}}> <RadioButton id='choice3-3' name='choice3-1' label=''  checked={this.state. SandBoxRadiobtn33} onChange={this.SandBoxRadioBtnChange} disabled={this.state.SandBoxRadiobtnDisable}/></td>
                                </TableRow>
                                <TableRow>
                                    <td>Storage Configuration</td>
                                    <td style={{textAlign:'center'}}><Select value={this.state.TestObj['TestStorage']} options={this.state.TestStrgList} className='DropdownStyle' onChange={this.TestStrgListChange.bind(this)}/></td>
                                    <td style={{textAlign:'center'}}><Select value={this.state.DevObj['DevStorage']} options={this.state.DevStrgList} className='DropdownStyle' onChange={this.DevStrgListChange.bind(this)}/></td>
                                    <td style={{textAlign:'center'}}><Select value={this.state.SandBoxObj['SandBoxStorage']} options={this.state.SandBoxStrgList} className='DropdownStyle' onChange={this.SandBoxStrgListChange.bind(this)} /></td>
                                </TableRow>
                            </tbody>
                        </Table>
                    </Box>
                </Article>
          </Box>
       );
    }

                   // <TableRow>
                    //     <td><Animate visible={this.state.TestObj['TestProcessor'] !== 'Select Processor' ||
                    //                           this.state.DevObj['DevProcessor'] !== 'Select Processor' ||
                    //                           this.state.SandBoxObj['SandBoxProcessor'] !== 'Select Processor' }
                    //             enter={{"animation": "slide-down", "duration": 300, "delay": 0}}
                    //             keep={false} style={{width:'100%'}}  >
                    //         Processor Quantity
                    //     </Animate></td>
                    //     <td><Animate visible={this.state.TestObj['TestProcessor'] !== 'Select Processor'}
                    //             enter={{"animation": "slide-down", "duration": 300, "delay": 0}}
                    //             keep={false} style={{width:'100%'}}  >
                    //             <Select value={this.state.TestObj['TestProcessorQty']} options={this.state.TestQAProcQtyList}  onChange={this.TestQAProcQtyListChange.bind(this)} className='DropdownStyle' />
                    //     </Animate></td>
                    //     <td><Animate visible={this.state.DevObj['DevProcessor'] !== 'Select Processor'}
                    //             enter={{"animation": "slide-down", "duration": 300, "delay": 0}}
                    //             keep={false} style={{width:'100%'}}  >
                    //             <Select value={this.state.DevObj['DevProcessorQty']} options={this.state.DevProcQtyList}  onChange={this.DevProcQtyListChange.bind(this)} className='DropdownStyle' />
                    //     </Animate></td>
                    //     <td><Animate visible={this.state.SandBoxObj['SandBoxProcessor'] !== 'Select Processor'}
                    //             enter={{"animation": "slide-down", "duration": 300, "delay": 0}}
                    //             keep={false} style={{width:'100%'}}  >
                    //             <Select value={this.state.SandBoxObj['SandBoxProcessorQty']} options={this.state.SandBoxProcQtyList}  onChange={this.SandBoxProcQtyListChange.bind(this)} className='DropdownStyle' />
                    //     </Animate></td>
                   // </TableRow>
}

const mapStateToProps = (state) => {
  return{
      activeSession: state.sessions.activeSession,
      sizerWorkLoad: state.sizerWorkload.workload
      
  };
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

export default connect(mapStateToProps,mapDispatchToProps)(OtherEnvironmentDetails);
