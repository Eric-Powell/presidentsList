function PresidentsList(props) {
  if (props.names) {
    let listItem = props.names.map((pres, idx) => (<li key={idx}>{pres}</li>));
    return <ul id="pres">{listItem}</ul>;
  }
  return <div id="error">There was a problem retrieving the list of Presidents. Please try again later.</div>;
}

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.searchResult = this.searchResult.bind(this);
  }

  searchResult(e) {
    this.props.onSearchResult(e.target.value)
    
  }

  render () {
    return (
      <form>
        <input 
          type="text" 
          placeholder="Search" 
          value={this.props.searchText}
          onChange={this.searchResult}
        />
      </form>
    )
  }  
}

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      names: [],
      origNames: [],
      searchText: "",
      sortBy: "",
      url: "https://presidentdata.azurewebsites.net/api/pres-names"
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.searchResult = this.searchResult.bind(this);
  }
  
  componentDidMount() { 
    let url = this.state.url;
    $.get(url)
    .done((data) => {
      let presidents = JSON.parse(data).name;
      this.setState({names: presidents});
      this.setState({origNames: presidents});
    })
    .fail((err) => {
      console.log("Request FAILED!", err);
    })
  }
  
  handleChange(event) {
    this.setState({sortBy: event.target.value});
  }

  handleSubmit(event) {
    let url = this.state.url;
    if (this.state.sortBy) {
      url = url + "?sort=" + this.state.sortBy;
    } 
    
    $.get(url)
    .done((data) => {
      let presidents = JSON.parse(data).name;    

      this.setState({names: presidents});
    })
    .fail((err) => {
      console.log("Request FAILED!", err);
    })
    event.preventDefault();
  }
  
  searchResult(target) {
  
    function capitolizeFirst(str) {
      let words = str.split(' ');
      let caps = words.map((word) => (word[0].toUpperCase() + word.slice(1)))
      return caps.join(' ');
    }   
    
    let searchText = target.toLowerCase();
    let searchResult = [];
    let names = this.state.origNames.slice();
    
    names.filter((pres) => {
      pres = pres.toLowerCase();
      if (pres.includes(searchText)) {
        searchResult.push(capitolizeFirst(pres))
      }
    })
    this.setState({searchText: target});
    this.setState({names: searchResult});   
  }
  
  render() {  
    return (
      <div>
        <Search 
          searchText={this.state.searchText}
          onSearchResult={this.searchResult}
        />
      
        <form onSubmit={this.handleSubmit}>
          <label>
            <select value={this.state.sortBy} onChange={this.handleChange}>
              <option value="">None</option>
              <option value="a">a to z</option>
              <option value="z">z to a</option>            
            </select>
          </label>          
          <input type="submit" value="Sort" />
        </form>
        <PresidentsList names={this.state.names} />        
      </div>      
    );
  }
  
}


ReactDOM.render(<Application />, document.getElementById("list"));