import { UserProvider } from './UserContext';
import { PlacesProvider } from './PlacesContext';
import { BorschProvider } from './BorschContext';
import { FiltersProvider } from './FiltersContext';
import { CommentsProvider } from './CommentsContext';

export const AppProvider = ({ children }) => {
  return (
    <UserProvider>
      <FiltersProvider>
        <PlacesProvider>
          <BorschProvider>
            <CommentsProvider>              
                {children}              
            </CommentsProvider>
          </BorschProvider>
        </PlacesProvider>
      </FiltersProvider>
    </UserProvider>
  );
};
