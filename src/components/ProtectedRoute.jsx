import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

function ProtectedRoute({ component, ...rest }) {
  const user = useSelector((state) => state.client.user);
  const isLoggedIn = Boolean(user?.email);
  const TargetComponent = component;

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        isLoggedIn ? (
          <TargetComponent {...routeProps} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: routeProps.location },
            }}
          />
        )
      }
    />
  );
}

export default ProtectedRoute;
