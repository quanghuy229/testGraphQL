import { SubmitHandler, Resolver } from 'react-hook-form';
import { useQuery, gql, useLazyQuery } from '@apollo/client';

type FormValues = {
  id?: number;
  description?: string;
  isFinished?: boolean;
};

export const FETCH_TODO = gql`
  query Query {
    todos {
      id
      description
      error
      isFinished
    }
  }
`;

export const CREATE_TODO = gql`
  mutation Query($createId: Int, $description: String) {
    create(id: $createId, description: $description) {
      description
      id
      isFinished
      error
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation Edit($editId: Int, $editDescription2: String, $isFinished: Boolean) {
    edit(id: $editId, description: $editDescription2, isFinished: $isFinished) {
      description
      error
      id
      isFinished
    }
  }
`;

export const DELETE_TODO = gql`
  mutation Query($deleteId: Int) {
    delete(id: $deleteId)
  }
`;

export const resolver: Resolver<FormValues> = async (values) => {
  if (!values.id) {
    return {
      values: {},
      errors: {
        id: {
          type: 'required',
          message: '* Id is required',
        },
      },
    };
  }
  if (isNaN(values.id)) {
    return {
      values: {},
      errors: {
        id: {
          type: 'isNumber',
          message: '* Id must be a number',
        },
      },
    };
  }
  if (!values.description) {
    return {
      values: {},
      errors: {
        description: {
          type: 'required',
          message: '* description is required',
        },
      },
    };
  }
  return {
    values: { id: values.id, description: values.description, isFinished: values.isFinished },
    errors: {},
  };
};
