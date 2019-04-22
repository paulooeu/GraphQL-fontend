import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { usersQuery } from "./UserList";
// import { Container } from './styles';
export const CreateUserMutation = gql`
  mutation CreateUser($name: String!, $email: String!) {
    CreateUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;
export default class UserForm extends Component {
  state = {
    name: "",
    emial: ""
  };
  handleSubmit = (e, CreateUser) => {
    e.preventDefault();
    const { name, email } = this.state;
    CreateUser({
      variables: { name, email },
      update: (proxy, { data: { CreateUser } }) => {
        const data = proxy.readQuery({
          query: usersQuery
        });

        data.users.push(CreateUser);

        proxy.writeQuery({
          query: usersQuery,
          data
        });
      }
    });
    this.setState({ name: "", email: "" });
  };
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { name, email } = this.state;
    return (
      <Mutation mutation={CreateUserMutation}>
        {CreateUser => (
          <form onSubmit={e => this.handleSubmit(e, CreateUser)}>
            <input name="name" value={name} onChange={this.handleChange} />
            <input name="email" value={email} onChange={this.handleChange} />
            <button type="submit">Enviar</button>
          </form>
        )}
      </Mutation>
    );
  }
}
