import React from 'react';
import ReactDOM from 'react-dom';

class PokeSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newElement: "",
            selectedElement: null,
            pokemons: []
        };
        this.handleClick = this.handleClick.bind(this);
    }


    newElementChange = (event) => {
        let value = event.target.value;
        this.setState(state => state.newElement = value);
    }

    selectedElementChange = (event) => {
        let value = event.target.value;
        this.setState(state => state.selectedElement = value);
    }

    async getPokemon(){
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=954")
        const data = await response.json()
        console.log(data)
        return data
    }

    
    getSelects() {
        let i = 0;
        let modArr = this.state.elements.slice(0);//Quand ta pas envie de faire d'effort.
        modArr.push("-- en dernier --");
        return modArr.map(item => <option key={i} value={i++}>{item}</option>);//mais genre vraiment pas
    }

 
    formSubmit = (event) => {

        this.setState(state => state.elements.splice(state.selectedElement, 0, state.newElement))
        this.setState(state => state.newElement = "");
        event.preventDefault();
    }

    async componentDidMount(){
        const json = await this.getPokemon();
        this.setState({pokemons: json.results})
    }
    
    handleClick(event)  {
        this.setState({selectedElement: event.target.id})
    }
    render() {     
        var detail;
        if (this.state.selectedElement != null) {
            detail = <PokeDetail pokemon={parseInt(this.state.selectedElement)+1} />
        } 
        const showList = this.state.pokemons.map((element,index) => {
            if (this.state.newElement === "") {
                return <li id={index} onClick={this.handleClick}>{element.name}</li>
            }
            else {
                if (element.name.includes(this.state.newElement)) {
                    return <li id={index} onClick={this.handleClick}>{element.name}</li>
                }
            }
            return null
        } )
        return (
            <div style={{display: "flex"}}>
                <div>
                    <form onSubmit={this.formSubmit}>
                        <span>Rechercher</span>
                        <input type="text" value={this.state.newElement} onChange={this.newElementChange} />

                    </form>
                    <ul>
                        {showList}
                    </ul>
                </div>
                {detail}
            </div>

            

        );
    }
}

class PokeDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pokemon: props.pokemon,
            detail:""
        };
      
    }
    async getPokemon() {
        console.log(this.state.pokemon)
        const response = await fetch("https://pokeapi.co/api/v2/pokemon/"+ this.state.pokemon)
        const data = await response.json()
        console.log(data)
        return data
    }
    async componentDidMount() {
        const json = await this.getPokemon();
        this.setState({ detail: json })
    }
    render() {
        var src = "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/Pokemon_XY_Sprites/"+this.state.pokemon+".png"  
        var detail = this.state.detail
        if(typeof detail.types !== "undefined"){
             var types = detail.types.map(element =>
            <li>{element.type.name}</li>
            )
        }
        if (typeof detail.stats !== "undefined") {
            var stats = detail.stats.map(element =>
                
                <div style={{ width: 255+'px', position: 'relative', marginBottom: 4+'px'}}>
                    <span>{element.base_stat} {element.stat.name}</span>
                    <div style={{ width: parseInt(element.base_stat)+'px', position: "absolute", left: 0+'px', bottom: 0+'px', border: 1+'px solid black'}}></div>
                </div>
            )
        }
        
        
        return (
            <div>
                <div style={{display: "flex"}}>
                    <img src={src}></img><h1>{detail.name}</h1>
                </div>
                <h2>Types:</h2>
                    {types}
                <h2>Base Stats:</h2>
                    {stats}
            </div>
            
        );
    }
}

ReactDOM.render(
    <PokeSearch/>,
    document.getElementById('root')
)