/* global Griddle React artists document ReactDOM location axios */

// https://admin.conceptionevents.com/34934696618/artist/Ui9Uvn4sXP
const BASE_URL = 'https://api.conceptionevents.com/api';
const showId = location.pathname.split('/')[2];

const LinkComponent = (props) => {
  const url = `/${showId}/artist/${props.rowData.user_token}`;
  return <a href={url}>{props.data}</a>;
};

const checkStatus = (props) => {
  const status = props.data ? 'true' : 'false';
  return <span>{status}</span>;
};


class textComponent extends React.Component {
  componentWillMount() {
    axios.get(`${BASE_URL}/artist/record?userToken=${this.props.rowData.user_token}&eventId=${showId}`)
    .then((res) => {
      this.setState({ data: res.data });
    }).catch(err => console.log(err));
  }

  render() {
    if (!this.state) {
      return <span />;
    }
    const { columnName } = this.props.metadata;
    return (
      <span>{this.state.data[columnName]}</span>
    );
  }
}

class tixComponent extends React.Component {
  componentWillMount() {
    axios.get(`${BASE_URL}/attendees/${showId}`)
    .then((res) => {
    //  this.setState({ data: res.data });
      const attendees = (res.data);
      const sales = attendees.filter(obj => obj.attendee.affiliate === this.props.rowData.user_token);
      this.setState({ sales });
    }).catch(err => console.log(err));
  }

  render() {
    if (!this.state) {
      return <span style={{ color: 'red' }}>calculating tix...</span>;
    }
    // const { columnName } = this.props.metadata;
    return (
      <span>{this.state.sales.length}</span>
    );
  }
}


LinkComponent.propTypes = {
  rowData: React.PropTypes.shape({
    user_token: React.PropTypes.string,
  }).isRequired,
  data: React.PropTypes.string.isRequired,
};


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
    columnName: 'booker',
    displayName: 'Booker',
    customComponent: textComponent,
  },
  {
    columnName: 'tix',
    displayName: 'Tickets',
    customComponent: tixComponent,
  },
  {
    columnName: 'status_2',
    displayName: 'Status 2',
    customComponent: textComponent,
  },
  {
    columnName: 'notes',
    displayName: 'Notes',
    customComponent: textComponent,
  },
  {
    columnName: 'approved',
    displayName: 'Approved',
    customComponent: checkStatus,
  },
];

class FilterArtist extends React.Component {
  constructor(props) {
    super(props);
    this.state = { artists: [] };
  }

  componentWillMount() {
    axios.get(`${BASE_URL}/all_artists/${showId}`)
  .then((res) => {
    this.setState({ artists: res.data });
  })
  .catch(err => console.log(err));
  }


  render() {
    return (
      <div>
        <Griddle
          results={this.state.artists}
          columns={['full_name', 'email', 'approved', 'booker', 'status', 'notes', 'tix']}
          showFilter
          resultsPerPage={10}
          columnMetadata={columnMeta}
        />
      </div>
    );
  }
}

ReactDOM.render(<FilterArtist />, document.querySelector('#artist-event-table'));
