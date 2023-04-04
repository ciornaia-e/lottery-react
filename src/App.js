import React from 'react'
import web3 from './web3'
import lottery from './lottery'
import './App.css'

class App extends React.Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  }

  async componentDidMount() {
    const manager = await lottery.methods.manager().call()
    const players = await lottery.methods.getPlayers().call()
    const balance = await web3.eth.getBalance(lottery.options.address)

    this.setState({ manager, players, balance })
  }

  onSubmit = async (event) => {
    event.preventDefault()

    const accounts = await web3.eth.getAccounts()

    this.setState({ message: 'Waiting on transaction success...' })

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    })

    this.setState({ message: 'You have been entered!' })
  }

  onClick = async () => {
    const accounts = await web3.eth.getAccounts()

    this.setState({ message: 'Waiting on transaction success...' })

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    })

    this.setState({ message: 'A winner has been picked!' })
  }

  render() {
    return (
      <div className='container'>
        <section>
          <h1>Lottery Contract</h1>
          <p>This contract is managed by <strong>{this.state.manager}</strong>.</p>
          <p>There are currently <strong>{this.state.players.length}</strong> people entered, competing to win
            <strong> {web3.utils.fromWei(this.state.balance, 'ether')}</strong> ether!
          </p>
        </section>

        <section>
          <form onSubmit={this.onSubmit}>
            <h2>Want to try your luck?</h2>
            <div className='input-wrapper'>
              <label>Amount of ether to enter</label>
              <input
                value={this.state.value}
                onChange={event => this.setState({ value: event.target.value })}
              />
            </div>
            <button>Enter</button>
          </form>
        </section>

        <section>
          <h2>Ready to pick a winner?</h2>
          <button onClick={this.onClick}>Pick a winner!</button>
        </section>

        <h2>{this.state.message}</h2>
      </div>
    )
  }
}

export default App
