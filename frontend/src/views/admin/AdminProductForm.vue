<template>
  <div class="admin-product-form">
    <div class="page-header">
      <div class="header-content">
        <router-link to="/admin/products" class="back-link">
          <ArrowLeft class="w-5 h-5" />
          Retour
        </router-link>
        <h1>{{ isEditing ? 'Modifier le produit' : 'Créer un nouveau produit' }}</h1>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="form-container">
      <div class="form-grid">
        <!-- Informations principales -->
        <div class="form-section">
          <h2>Informations principales</h2>
          
          <div class="form-group">
            <label for="nom">Nom du produit *</label>
            <input
              id="nom"
              v-model="form.nom"
              type="text"
              required
              placeholder="Nom du produit"
            />
          </div>

          <div class="form-group">
            <label for="sku">SKU *</label>
            <input
              id="sku"
              v-model="form.sku"
              type="text"
              required
              placeholder="SKU-001"
            />
          </div>

          <div class="form-group">
            <label for="prix">Prix (€) *</label>
            <input
              id="prix"
              v-model.number="form.prix"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="0.00"
            />
          </div>

          <div class="form-group">
            <label for="categorie_id">Catégorie *</label>
            <select id="categorie_id" v-model="form.categorie_id" required>
              <option value="">Sélectionner une catégorie</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.nom }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="quantite_stock">Quantité en stock *</label>
            <input
              id="quantite_stock"
              v-model.number="form.quantite_stock"
              type="number"
              min="0"
              required
              placeholder="0"
            />
          </div>
        </div>

        <!-- Description -->
        <div class="form-section">
          <h2>Description</h2>
          
          <div class="form-group">
            <label for="description_courte">Description courte</label>
            <textarea
              id="description_courte"
              v-model="form.description_courte"
              rows="3"
              placeholder="Bref description du produit"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="description">Description complète *</label>
            <textarea
              id="description"
              v-model="form.description"
              rows="6"
              required
              placeholder="Description détaillée du produit"
            ></textarea>
          </div>
        </div>

        <!-- Images -->
        <div class="form-section full-width">
          <h2>Images du produit</h2>
          
          <div class="image-upload-area">
            <div v-for="(image, index) in form.images" :key="index" class="uploaded-image">
              <img :src="image.url_image" :alt="`Image ${index + 1}`" />
              <button type="button" class="remove-image" @click="removeImage(index)">
                <X class="w-4 h-4" />
              </button>
              <div class="image-primary-badge" v-if="image.est_principale">
                Principale
              </div>
            </div>

            <div class="upload-box" @click="triggerFileInput">
              <Upload class="w-8 h-8 text-(--text-muted)" />
              <p>Cliquez pour uploader une image</p>
              <span class="text-sm text-(--text-muted)">PNG, JPG jusqu'à 5MB</span>
            </div>
            
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              hidden
            />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <router-link to="/admin/products" class="btn btn-secondary">
          Annuler
        </router-link>
        <Button type="submit" variant="primary" :loading="saving">
          {{ isEditing ? 'Mettre à jour' : 'Créer le produit' }}
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { AxiosError } from 'axios'
import { productsAPI } from '../../api/products'
import { categoriesAPI } from '../../api/categories'
import { uploadAPI } from '../../api/upload'
import { useToast } from '../../composables/useToast'
import Button from '../../components/ui/Button.vue'
import type { Category, Product, ApiError } from '../../types/api'
import { ArrowLeft, Upload, X } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const fileInput = ref<HTMLInputElement>()
const saving = ref(false)
const categories = ref<Category[]>([])

const originalProduct = ref<Product | null>(null)
const isEditing = computed(() => !!route.params.id)

/**
 * Interface pour les images du formulaire
 */
interface FormImage {
  url_image: string
  est_principale: boolean
}

const form = reactive({
  nom: '',
  description: '',
  description_courte: '',
  sku: '',
  prix: 0,
  categorie_id: '',
  quantite_stock: 0,
  images: [] as FormImage[],
})

const loadProduct = async (id: string) => {
  try {
    const response = await productsAPI.getById(id)
    const product = response.data
    if (!product) throw new Error('Produit non trouvé')
    Object.assign(form, {
      nom: product.nom,
      description: product.description,
      description_courte: product.description_courte || '',
      sku: product.sku,
      prix: Number(product.prix),
      categorie_id: product.categorie_id || product.categorie?.id,
      quantite_stock: Number(product.quantite_stock),
      images: product.images || product.images_produits || [],
    })
    // Keep a copy of the original product to send only changed fields on update
    originalProduct.value = product
  } catch (error) {
    console.error('Erreur lors du chargement du produit:', error)
  }
}

const loadCategories = async () => {
  try {
    const response = await categoriesAPI.getAll()
    categories.value = response.data || []
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error)
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    const response = await uploadAPI.uploadImage(file)
    const imageUrl = response.data?.url
    if (!imageUrl) throw new Error('URL d\'image non retournée')
    
    form.images.push({
      url_image: imageUrl,
      est_principale: form.images.length === 0,
    })
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error)
  }
}

const removeImage = (index: number) => {
  form.images.splice(index, 1)
}

/**
 * Nettoyer les images - supprimer les entrées avec url_image undefined/null
 */
const cleanImages = (images: FormImage[]): FormImage[] => {
  return images.filter((img): img is FormImage => 
    Boolean(img && img.url_image && typeof img.url_image === 'string')
  )
}

const handleSubmit = async () => {
  saving.value = true
  try {
    // Build productData depending on whether we're creating or updating
    let productData: Record<string, any> = {}

    if (isEditing.value) {
      if (!originalProduct.value) throw new Error('Produit introuvable pour la mise à jour')

      if (form.nom !== originalProduct.value.nom) productData.nom = form.nom
      if (form.description !== originalProduct.value.description) productData.description = form.description
      if ((form.description_courte || '') !== (originalProduct.value.description_courte || '')) productData.description_courte = form.description_courte
      if (form.sku !== originalProduct.value.sku) productData.sku = form.sku
      if (Number(form.prix) !== Number(originalProduct.value.prix)) productData.prix = Number(form.prix)
      if (Number(form.quantite_stock) !== Number(originalProduct.value.quantite_stock)) productData.quantite_stock = Number(form.quantite_stock)

      const originalCategoryId = originalProduct.value.categorie_id || originalProduct.value.categorie?.id || ''
      if (form.categorie_id && form.categorie_id.trim() !== '' && form.categorie_id !== originalCategoryId) {
        productData.categorie_id = form.categorie_id
      }

      if (JSON.stringify(form.images || []) !== JSON.stringify(originalProduct.value.images || originalProduct.value.images_produits || [])) {
        const cleanedImages = cleanImages(form.images || [])
        if (cleanedImages.length > 0) {
          productData.images = cleanedImages
        }
      }

      // If nothing changed, avoid sending an empty PUT
      if (Object.keys(productData).length === 0) {
        toast.warning('Aucune modification détectée.')
        return
      }

      console.log('Données envoyées (update):', productData)
      await productsAPI.update(route.params.id as string, productData)
      toast.success('Produit mis à jour avec succès!')
      router.push('/admin/products')
    } else {
      // Creation: ensure required fields are present
      if (!form.categorie_id || form.categorie_id.trim() === '') {
        toast.error('Veuillez sélectionner une catégorie')
        return
      }

      productData = {
        nom: form.nom || '',
        description: form.description || '',
        description_courte: form.description_courte || '',
        sku: form.sku || '',
        prix: Number(form.prix) || 0,
        quantite_stock: Number(form.quantite_stock) || 0,
        images: cleanImages(form.images || []),
        categorie_id: form.categorie_id,
      }

      console.log('Données envoyées (create):', productData)
      await productsAPI.create(productData)
      toast.success('Produit créé avec succès!')
      router.push('/admin/products')
    }
  } catch (err: unknown) {
    console.error('Erreur lors de l\'enregistrement:', err)
    // Show user-friendly error message
    const axiosError = err as AxiosError<ApiError>
    const messageData = axiosError.response?.data?.message
    const messageString = Array.isArray(messageData) ? messageData.join(', ') : (messageData || '')
    const errorMessage = messageString || (typeof axiosError.message === 'string' ? axiosError.message : 'Erreur lors de l\'enregistrement du produit')
    toast.error(errorMessage)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadCategories()
  if (isEditing.value) {
    loadProduct(route.params.id as string)
  }
})
</script>

<style scoped>
.admin-product-form {
  max-width: 1000px;
}

.page-header {
  margin-bottom: 2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.back-link:hover {
  color: var(--text-primary);
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.form-container {
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
  border-radius: 1rem;
  padding: 2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.form-section.full-width {
  grid-column: 1 / -1;
}

.form-section h2 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-light);
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-light);
  border-radius: 0.5rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.9375rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.image-upload-area {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.uploaded-image {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid var(--border-light);
}

.uploaded-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: rgba(220, 38, 38, 0.9);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-primary-badge {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: var(--color-primary);
  color: white;
  font-size: 0.75rem;
  border-radius: 0.25rem;
}

.upload-box {
  width: 120px;
  height: 120px;
  border: 2px dashed var(--border-light);
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-box:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-50);
}

.upload-box p {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: center;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-light);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-light);
}

/* Responsive styles */
@media (max-width: 1024px) {
  .admin-product-form {
    max-width: 100%;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .form-section.full-width {
    grid-column: 1;
  }

  .form-container {
    padding: 1.5rem;
  }
}

@media (max-width: 640px) {
  .page-header {
    margin-bottom: 1.5rem;
  }

  .page-header h1 {
    font-size: 1.25rem;
  }

  .form-container {
    padding: 1rem;
    border-radius: 0.75rem;
  }

  .form-actions {
    flex-direction: column-reverse;
    gap: 0.75rem;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
  }

  .form-actions .btn {
    width: 100%;
    justify-content: center;
  }

  .uploaded-image,
  .upload-box {
    width: 100px;
    height: 100px;
  }

  .upload-box p {
    display: none;
  }
}
</style>

