import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Sparkles, ArrowRight, Check, Phone, MapPin, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

export function Register() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: ''
  });
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
    } else {
      if (formData.password !== formData.confirmPassword) {
        toast.error('Les mots de passe ne correspondent pas');
        return;
      }
      setIsLoading(true);
      try {
        const { confirmPassword, ...registerData } = formData;
        await register(registerData);
        toast.success('Compte cree avec succes !');
        navigate('/login');
      } catch (error: any) {
        const message = error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription';
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const strength = passwordStrength(formData.password);
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthLabels = ['Faible', 'Moyen', 'Bon', 'Excellent'];

  return (
    <div className="min-h-screen flex bg-[#f0f8ff]">
      {/* Left Side - Steps */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0879bf] via-[#3eb3f2] to-[#81cdf8] p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-white max-w-lg"
        >
          <Sparkles className="w-16 h-16 mb-6" />
          <h1 className="text-4xl font-bold mb-8">Créez votre compte</h1>

          <div className="space-y-6">
            {[
              { num: 1, title: 'Informations personnelles', desc: 'Nom, email et mot de passe' },
              { num: 2, title: 'Confirmation', desc: 'Vérifiez vos informations' }
            ].map((s) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: s.num * 0.1 }}
                className={`flex items-start gap-4 p-4 rounded-xl ${step >= s.num ? 'bg-white/20 backdrop-blur-sm' : 'opacity-50'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step > s.num ? 'bg-white text-[#0879bf]' : step === s.num ? 'bg-white/30 text-white' : 'bg-white/10 text-white/50'}`}>
                  {step > s.num ? <Check className="w-6 h-6" /> : s.num}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{s.title}</h3>
                  <p className="text-sm text-white/80">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex w-14 h-14 bg-gradient-to-br from-[#3eb3f2] to-[#0879bf] rounded-xl items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Inscription</h2>
            <p className="text-gray-600">Étape {step} sur 2</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#bce3fb]/30">
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <Input
                    label="Nom complet"
                    type="text"
                    placeholder="Marie Dubois"
                    icon={<User className="w-5 h-5" />}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Téléphone"
                      type="tel"
                      placeholder="0612345678"
                      icon={<Phone className="w-5 h-5" />}
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      required
                    />
                    <Input
                      label="Adresse"
                      type="text"
                      placeholder="Paris, France"
                      icon={<MapPin className="w-5 h-5" />}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>

                  <Input
                    label="Email"
                    type="email"
                    placeholder="votre@email.com"
                    icon={<Mail className="w-5 h-5" />}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />

                  <div>
                    <Input
                      label="Mot de passe"
                      type="password"
                      placeholder="••••••••"
                      icon={<Lock className="w-5 h-5" />}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[0, 1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full ${i < strength ? strengthColors[strength - 1] : 'bg-gray-200'}`}
                            />
                          ))}
                        </div>
                        {strength > 0 && (
                          <p className="text-xs text-gray-600">Force: {strengthLabels[strength - 1]}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <Input
                    label="Confirmer le mot de passe"
                    type="password"
                    placeholder="••••••••"
                    icon={<Lock className="w-5 h-5" />}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-[#f0f8ff] rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Nom</p>
                      <p className="font-medium text-gray-900">{formData.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{formData.email}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="font-medium text-gray-900">{formData.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Adresse</p>
                        <p className="font-medium text-gray-900">{formData.address}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                  </p>
                </motion.div>
              )}

              <div className="flex gap-3">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="flex-1"
                  >
                    Retour
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  size="lg"
                  disabled={isLoading}
                  icon={isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                >
                  {isLoading ? 'Création...' : step < 2 ? 'Continuer' : 'Créer mon compte'}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Déjà un compte ?{' '}
                <Link to="/login" className="text-[#0879bf] hover:text-[#065d93] font-medium">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
