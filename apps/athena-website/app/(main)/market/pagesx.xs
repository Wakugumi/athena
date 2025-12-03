              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-600">
                    {listing.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {formatMeta(listing)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(listing)}
                  </p>
                  {typeof listing.downloads === "number" && (
                    <p className="text-xs text-gray-500">{listing.downloads} downloads</p>
                  )}
                </div>
              </div>
              <div className="prose prose-sm mt-3 max-w-none line-clamp-5 text-gray-600">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                  {listing.preview?.trim() || listing.summary || ""}
                </ReactMarkdown>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>Items: {listing.items?.length ?? 0}</span>
                <span className="inline-flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 15.707a1 1 0 01-1.414 0l-5.586-5.586a1 1 0 011.414-1.414L9 13.586V3a1 1 0 112 0v10.586l4.293-4.293a1 1 0 111.414 1.414l-5.586 5.586z"
                      clipRule="evenodd"
                    />
                  </svg>
                  View & Purchase
                </span>
              </div>
 
