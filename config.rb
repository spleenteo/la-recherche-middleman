page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

set :url_root, ''

ignore '/templates/*'

activate :i18n, :langs => [:it, :en], :mount_at_root => false
activate :asset_hash
activate :directory_indexes
activate :pagination
activate :dato,
  token: ENV['DATO_TOKEN'],
  live_reload: true

activate :external_pipeline,
  name: :webpack,
  command: build? ?
    "./node_modules/webpack/bin/webpack.js --bail -p" :
    "./node_modules/webpack/bin/webpack.js --watch -d --progress --color",
  source: ".tmp/dist",
  latency: 1

configure :build do
  activate :minify_html do |html|
    html.remove_input_attributes = false
  end
  activate :search_engine_sitemap,
    default_priority: 0.5,
    default_change_frequency: 'weekly'
end

configure :development do
  activate :livereload
end

helpers do
  def active_link_to(name, url, options = {})
    if current_page.url.include? url
      options[:class] = options.fetch(:class, '') + " is-active"
      link_to name, url, options
    else
      link_to name, url, options
    end
  end

  def path(id, parent = nil, params = {}, lang = I18n.locale)
    if id == "home"
      locale_url_prefix(lang)
    elsif parent.present?
      chunk = I18n.with_locale(lang) { I18n.t("paths.#{parent}", params.merge(default: id)) } + "/" +
        I18n.with_locale(lang) { I18n.t("paths.#{id}", params.merge(default: id)) }
      locale_url_prefix(lang) + chunk
    else
      chunk = I18n.with_locale(lang) { I18n.t("paths.#{id}", params.merge(default: id)) }
      locale_url_prefix(lang) + chunk
    end
  end

  def locale_url_prefix(lang = I18n.locale)
    lang == :it ? "/#{lang}/" : "/#{lang}/"
  end
end

dato.tap do |dato|
  [:it, :en].each do |locale|
    I18n.with_locale(locale) do
      proxy "/#{locale}/#{dato.about_page.slug}/index.html",
        "/templates/page.html",
        locals: { page: dato.about_page },
        locale: locale

      proxy "/#{locale}/#{dato.materials_page.slug}/index.html",
        "/templates/page.html",
        locals: { page: dato.materials_page },
        locale: locale

      proxy "/#{locale}/#{dato.atmospheres_page.slug}/index.html",
        "/templates/page.html",
        locals: { page: dato.atmospheres_page },
        locale: locale

      proxy "/#{locale}/#{dato.contacts_page.slug}/index.html",
        "/templates/contacts.html",
        locals: { page: dato.contacts_page },
        locale: locale

      dato.products_categories.select{ |category| !category.parent }.each do |category|
        category_products = dato.products.select{ |products| products.category == category}
        proxy "/#{locale}/#{category.slug}/index.html",
          "/templates/first-level-category.html",
          locals: { page: category, second_level_categories: category.children, products: category_products},
          locale: locale

        category.children.each do |children_category|
          category_products = dato.products.select{ |products| products.category == children_category}
          proxy "/#{locale}/#{category.slug}/#{children_category.slug}/index.html",
            "/templates/second-level-category.html",
            locals: { page: children_category, parent: category, products: category_products },
            locale: locale
        end
      end
      dato.products.each do |product|
        proxy "/#{locale}/#{product.slug}/index.html",
          "/templates/product.html",
          locals: { page: product },
          locale: locale
      end
    end
  end
end
