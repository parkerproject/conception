/* global Griddle React artists document ReactDOM axios */

const BASE_EVENT_URL = 'https://api.conceptionevents.com/api/event/';


const LinkComponent = (props) => {
  const url = `/artist/${props.rowData.user_token}`;
  return <a href={url}>{props.data}</a>;
};

LinkComponent.propTypes = {
  rowData: React.PropTypes.shape({
    user_token: React.PropTypes.string,
  }).isRequired,
  data: React.PropTypes.string.isRequired,
};

const checkStatus = (props) => {
  const status = props.data ? 'true' : 'false';
  return <span>{status}</span>;
};

async function getEventInfo(id) {
  const res = await axios.get(BASE_EVENT_URL + id);
  return res.data;
}

async function getEvent(props) {
  const shows = await Promise.all(props.data.map(show => getEventInfo(show)));
  const onlyLiveEvents = shows.filter(show => show.status === 'Live');
  return onlyLiveEvents;
}


function showsComponent(props) {
  const events = getEvent(props);

  events.then((results) => {
    results.forEach((result) => {
      console.log(result.id, result.title, result.start_date);
      // const node = document.createElement('li');
      // const textnode = document.createTextNode(`${result.title} - ${result.start_date}`);
      // node.appendChild(textnode);                              // A
      document.getElementById(`${result.id}`).textContent = `${result.title} - ${result.start_date}`;
    });
  });

  return <ul>{props.data.map(data => <li id={data}>---</li>)}</ul>;
}

const columnMeta = [
  {
    columnName: 'full_name',
    customComponent: LinkComponent,
    displayName: 'Artist Name',
  },
  {
    columnName: 'email',
    displayName: 'Email',
  },
  {
    columnName: 'genre',
    displayName: 'Genre',
  },
  {
    columnName: 'approved',
    displayName: 'Approved',
    customComponent: checkStatus,
  },
  {
    columnName: 'events',
    displayName: 'Events',
    customComponent: showsComponent,
  },
];


class FilterArtist extends React.Component {
  constructor(props) {
    super(props);
    this.state = { artists };
  }


  render() {
    return (
      <div>
        <Griddle
          results={this.state.artists}
          columns={['full_name', 'email', 'approved', 'genre', 'events']}
          showFilter
          resultsPerPage={10}
          columnMetadata={columnMeta}
          showSettings
        />
      </div>
    );
  }
}

ReactDOM.render(<FilterArtist />, document.querySelector('#artist-table'));
