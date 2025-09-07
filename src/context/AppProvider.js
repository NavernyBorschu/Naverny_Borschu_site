import { UserProvider } from './UserContext';
import { PlacesProvider } from './PlacesContext';
import { BorschProvider } from './BorschContext';
import { FiltersProvider } from './FiltersContext';
import { CommentsProvider } from './CommentsContext';

export const AppProvider = ({ children }) => {
  return (
    <UserProvider>
      <PlacesProvider>
        <BorschProvider>
          <CommentsProvider>
            <FiltersProvider>
              {children}
            </FiltersProvider>
          </CommentsProvider>
        </BorschProvider>
      </PlacesProvider>
    </UserProvider>
  );
};
