import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Collapse} from 'reactstrap';
import { Form, FormGroup, Input, Button, Label } from 'reactstrap';

import { FaChevronRight, FaChevronDown, MdDelete } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.css';
import './DynamicOptions.css'

class DynamicOptions extends Component {
	constructor(props) {
    super(props);
		this.state = { collapse: {} };
  }
	toggle = (id) => {
    this.setState( prevState => {
			return { collapse: {...prevState.collapse, [id]: !prevState.collapse[id] }};
		})
  }

	//build item
	buildList = (options, parents, level=1) => {
		if(level==3)
			return;
		const { values, selected, name} = this.props;
		const items = [];
		const id = parents[parents.length-1].id;
		for( let key of Object.keys(options)){
			const option = options[key]
			const _children = option.children;
			const _parents = parents.slice()
			_parents.push({id: option.id, name: option.name})
			const itemStyle = {paddingLeft: 20*level}

			//for first level
			if(level==1){
				const children = this.buildList(_children, _parents, level+1);
				items.push(<ListGroupItem key={option.id}>
											<div className="d-flex align-items-center">
												<div className="d-flex align-items-center option-list-collapse-button mr-auto" onClick={ () => this.toggle(key) }> {this.state.collapse[key]?<FaChevronDown/>:<FaChevronRight/>} {option.name}</div>
												<Button className="" color="link" onClick={()=> this.props.onDeleteOption(_parents)}><MdDelete/></Button>
											</div>
									 </ListGroupItem>)
				items.push(<Collapse key={option.id+"-children"} isOpen={this.state.collapse[key]}>{children}</Collapse>)
			}else{
				if(selected.length>0 && option.id===selected[selected.length-1].id)
					itemStyle = {...itemStyle, background: '#e4e4e4'}
				items.push(<ListGroupItem key={option.id} style={itemStyle}>
											<div className="d-flex align-items-center">
												<div className="d-flex align-items-center option-list-collapse-button mr-auto" onClick={()=> this.props.onSelectOption(name, _parents)}> {id==='3'?<span style={{paddingRight: 8}}>Object on:</span>:""} {option.name}</div>
												<Button className="" color="link" onClick={()=> this.props.onDeleteOption(_parents)}><MdDelete/></Button>
											</div>
									 </ListGroupItem>)
			}
			//for second level






		}
		const form = <ListGroupItem key={id+"-new"} style={{paddingLeft: 20*level}}>
									 <Form inline onSubmit={ e =>{this.props.onAddOption(e, name, parents)}} >
										 {id==='3'?<Label className="mr-sm-2">Object on:</Label>:""} <Input className="mr-sm-2" type="text" name={id} value={values[id]} onChange={e => this.props.onInputChange(name, e)} /><Input type="submit" value="Submit" className="my-2 my-sm-0"/>
									 </Form>
								 </ListGroupItem>
		items.push(form)
		return <ListGroup className="option-list-ul">{items}</ListGroup>;
	}

	render() {
		const {options} = this.props;
		const list = this.buildList(options, [{id: -1, name: "root"}]);
		return(
			<div className="px-3">
					{list}
			</div>
	)}

}
export default DynamicOptions;