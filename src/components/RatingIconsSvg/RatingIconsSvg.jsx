import { ReactComponent as IconStarFull } from './lsicon_soup-filled.svg';
import { ReactComponent as IconStarEmpty } from './lsicon_soup-outline.svg';

export const RatingIconsSvg = ({
  overall_rating = 0,
  max = 10,
  size = 24,
  FullIcon = IconStarFull,
  EmptyIcon = IconStarEmpty,
}) => {
  const rating = Math.round(parseFloat(overall_rating));
  const fullCount = Math.min(rating, max);
  const emptyCount = Math.max(max - fullCount, 0);

  const iconStyle = {
    width: `${size}px`,
    height: `${size}px`,
  };

  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[...Array(fullCount)].map((_, i) => (
        <FullIcon key={`full-${i}`} style={iconStyle} />
      ))}
      {[...Array(emptyCount)].map((_, i) => (
        <EmptyIcon key={`empty-${i}`} style={iconStyle} />
      ))}
    </div>
  );
};
