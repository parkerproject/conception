/* global Griddle React artists document ReactDOM */

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
          columns={['full_name', 'email', 'approved', 'genre']}
          showFilter
          resultsPerPage={10}
          columnMetadata={columnMeta}
        />
      </div>
    );
  }
}

ReactDOM.render(<FilterArtist />, document.querySelector('#artist-table'));
