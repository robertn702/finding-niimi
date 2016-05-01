/**
 * DESCRIPTION
 *
 * @prop {type} PROP - PROP_DESCRIPTION
 */

import Ajax from 'ajax_utils';

export default class App extends React.Component {
  static displayName = 'App';
  static propTypes = {
    children: React.PropTypes.node
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='app'>
        {'TEMPLATE'}
        {this.props.children}
      </div>
    );
  }
}
