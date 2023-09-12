interface MetaCardProps {
  title: string;
  description?: string;
  imgSrc?: string;
}
function MetaCard({ title, description, imgSrc }: MetaCardProps) {
  return (
    <div className="flex gap-3 px-4">
      <div className="flex flex-col justify-center items-center">
        {imgSrc && (
          <div className="flex h-16 w-16 justify-center items-center">
            <img className="object-scale-down h-14 w-14" src={imgSrc} />
          </div>
        )}
      </div>

      <div className="flex flex-col w-full self-center">
        <p className="text-ellipsis overflow-hidden ... text-gray-600 text-base">
          {title}
        </p>
        <p className="line-clamp-3 text-gray-400 text-xs leading-4 min-h-[2rem]">
          {description}
        </p>
      </div>
    </div>
  );
}

export default MetaCard;
