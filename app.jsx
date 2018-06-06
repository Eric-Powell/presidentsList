function PresidentsList(props) {
  if (props.names) {
    let listItem = props.names.map((pres, idx) => (<li key={idx}>{pres}</li>));
    return <ul id="pres">{listItem}</ul>;
  }
  return <div id="error">There was a problem retrieving the list of Presidents. Please try again later.</div>;
}


class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      names: [],
      sortBy: "",
      url: "https://presidentdata.azurewebsites.net/api/pres-names"
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  componentDidMount() { 
    let url = this.state.url;
    $.get(url)
    .done((data) => {
      let presidents = JSON.parse(data).name;
      this.setState({names: presidents});
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
  
  render() {  
    return (
    	<div>
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